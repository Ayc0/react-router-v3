// This is a fork from @types/react-router@3.0.28
// Type definitions for . 3.0
// Project: https://github.com/rackt/.
// Definitions by: Sergey Buturlakin <https://github.com/sergey-buturlakin>
//                 Yuichi Murata <https://github.com/mrk21>
//                 Václav Ostrožlík <https://github.com/vasek17>
//                 Nathan Brown <https://github.com/ngbrown>
//                 Alex Wendland <https://github.com/awendland>
//                 Kostya Esmukov <https://github.com/KostyaEsmukov>
//                 John Reilly <https://github.com/johnnyreilly>
//                 Karol Janyst <https://github.com/LKay>
//                 Dovydas Navickas <https://github.com/DovydasNavickas>
//                 Ross Allen <https://github.com/ssorallen>
//                 Christian Gill <https://github.com/gillchristian>
//                 Roman Nevolin <https://github.com/nulladdict>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Minimum TypeScript Version: 3.5

export {
  ChangeHook,
  EnterHook,
  InjectedRouter,
  LeaveHook,
  ParseQueryString,
  RouteComponent,
  RouteComponents,
  RouteComponentProps,
  RouteConfig,
  RoutePattern,
  RouterProps,
  RouterState,
  RedirectFunction,
  StringifyQuery
} from './Router'
export { LinkProps } from './Link'
export { IndexLinkProps } from './IndexLink'
export { RouteProps, PlainRoute } from './Route'
export { IndexRouteProps } from './IndexRoute'
export { RedirectProps } from './Redirect'
export { IndexRedirectProps } from './IndexRedirect'
export { WithRouterProps } from './withRouter'

/* components */
export { default as Router } from './Router'
export { default as Link } from './Link'
export { default as IndexLink } from './IndexLink'
export { default as withRouter } from './withRouter'

/* components (configuration) */
export { default as IndexRedirect } from './IndexRedirect'
export { default as IndexRoute } from './IndexRoute'
export { default as Redirect } from './Redirect'
export { default as Route } from './Route'

/* utils */
export { createRoutes } from './RouteUtils'
export { default as RouterContext } from './RouterContext'
export { routerShape, locationShape } from './PropTypes'
export {
  default as match,
  MatchHistoryArgs,
  MatchLocationArgs,
  MatchCallback
} from './match'
export { default as useRouterHistory } from './useRouterHistory'
export { formatPattern } from './PatternUtils'
export { default as applyRouterMiddleware } from './applyRouterMiddleware'

/* histories */
export { default as browserHistory } from './browserHistory'
export { default as hashHistory } from './hashHistory'
export { default as createMemoryHistory } from './createMemoryHistory'
