import invariant from 'invariant'
import { createRouteFromReactElement } from './RouteUtils'
import { formatPattern } from './PatternUtils'

/**
 * A <Redirect> is used to declare another URL path a client should
 * be sent to when they request a given URL.
 *
 * Redirects are placed alongside routes in the route configuration
 * and are traversed in the same manner.
 */
/* eslint-disable react/require-render-return */
function Redirect() {
  /* istanbul ignore next: sanity check */
  invariant(
    false,
    '<Redirect> elements are for router configuration only and should not be rendered'
  )
}

Redirect.createRouteFromReactElement = (element) => {
  const route = createRouteFromReactElement(element)

  if (route.from) route.path = route.from

  route.onEnter = function (nextState, replace) {
    const { location, params } = nextState

    let pathname
    if (route.to.charAt(0) === '/') {
      pathname = formatPattern(route.to, params)
    } else if (!route.to) {
      pathname = location.pathname
    } else {
      let routeIndex = nextState.routes.indexOf(route)
      let parentPattern = Redirect.getRoutePattern(
        nextState.routes,
        routeIndex - 1
      )
      let pattern = parentPattern.replace(/\/*$/, '/') + route.to
      pathname = formatPattern(pattern, params)
    }

    replace({
      pathname,
      query: route.query || location.query,
      state: route.state || location.state
    })
  }

  return route
}

Redirect.getRoutePattern = (routes, routeIndex) => {
  let parentPattern = ''

  for (let i = routeIndex; i >= 0; i--) {
    const route = routes[i]
    const pattern = route.path || ''

    parentPattern = pattern.replace(/\/*$/, '/') + parentPattern

    if (pattern.indexOf('/') === 0) break
  }

  return '/' + parentPattern
}

export default Redirect
