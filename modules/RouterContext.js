import invariant from 'invariant'
import React from 'react'
import { isValidElementType } from 'react-is'

import getRouteParams from './getRouteParams'
import { isReactChildren } from './RouteUtils'

export const routerContext = React.createContext()

/**
 * A <RouterContext> renders the component tree for a given router state
 * and sets the history object and the current location in context.
 */
function RouterContext({
  createElement: createElementProp = React.createElement,
  location,
  routes,
  params,
  components,
  router
}) {
  const createElement = (component, props) => {
    return component == null ? null : createElementProp(component, props)
  }

  const renderChildren = () => {
    let element = null

    if (components) {
      element = components.reduceRight((element, components, index) => {
        if (components == null) return element // Don't create new children; use the grandchildren.

        const route = routes[index]
        const routeParams = getRouteParams(route, params)
        const props = {
          location,
          params,
          route,
          router,
          routeParams,
          routes
        }

        if (isReactChildren(element)) {
          props.children = element
        } else if (element) {
          for (const prop in element)
            if (Object.prototype.hasOwnProperty.call(element, prop))
              props[prop] = element[prop]
        }

        // Handle components is object for { [name]: component } but not valid element
        // type of react, such as React.memo, React.lazy and so on.
        if (typeof components === 'object' && !isValidElementType(components)) {
          const elements = {}

          for (const key in components) {
            if (Object.prototype.hasOwnProperty.call(components, key)) {
              // Pass through the key as a prop to createElement to allow
              // custom createElement functions to know which named component
              // they're rendering, for e.g. matching up to fetched data.
              elements[key] = createElement(components[key], {
                key,
                ...props
              })
            }
          }

          return elements
        }

        return createElement(components, props)
      }, element)
    }

    invariant(
      element === null || element === false || React.isValidElement(element),
      'The root route must render a single element'
    )

    return element
  }

  return (
    <routerContext.Provider value={router}>{renderChildren()}</routerContext.Provider>
  )
}

export default RouterContext
