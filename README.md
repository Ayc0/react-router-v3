# React Router [![npm package][npm-badge]][npm]

<img src="/logo/vertical@2x.png" height="150"/>

React Router is a complete routing library for [React](https://facebook.github.io/react).

React Router keeps your UI in sync with the URL. It has a simple API with powerful features like lazy code loading, dynamic route matching, and location transition handling built right in. Make the URL your first thought, not an after-thought.

### 4.0 is here!

The next version of React Router (4.0) has been released! Check out the `master` branch.

[4.0 Documentation](https://reacttraining.com/react-router/)

### Docs & Help

- [Tutorial – do this first!](https://github.com/reactjs/react-router-tutorial)
- [Guides and API docs (v2, v3)](/docs)
- [Troubleshooting guide](https://github.com/ReactTraining/react-router/blob/master/docs/Troubleshooting.md)
- [Changelog](/CHANGES.md)
- [Stack Overflow](http://stackoverflow.com/questions/tagged/react-router)
- [CodePen boilerplate](http://codepen.io/anon/pen/xwQZdy?editors=001) for bug reports

**Older Versions:**

- 0.13.x - [docs](https://github.com/ReactTraining/react-router/tree/v0.13.6/doc) / [guides](https://github.com/ReactTraining/react-router/tree/v0.13.6/docs/guides) / [code](https://github.com/ReactTraining/react-router/tree/v0.13.6) / [upgrade guide](/upgrade-guides/v1.0.0.md)
- 1.0.x - [docs](https://github.com/ReactTraining/react-router/tree/1.0.x/docs) / [code](https://github.com/ReactTraining/react-router/tree/1.0.x) / [upgrade guide](/upgrade-guides/v2.0.0.md)

For questions and support, please visit [our channel on Reactiflux](https://discord.gg/0ZcbPKXt5bYaNQ46) or [Stack Overflow](http://stackoverflow.com/questions/tagged/react-router).

### Browser Support

We support all browsers and environments where React runs.

### Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-router

Then with a module bundler like [webpack](https://webpack.github.io/) that supports either CommonJS or ES2015 modules, use as you would anything else:

```js
// using an ES6 transpiler, like babel
import { Router, Route, Link } from "react-router";

// not using an ES6 transpiler
var Router = require("react-router").Router;
var Route = require("react-router").Route;
var Link = require("react-router").Link;
```

### What's it look like?

```js
import React from "react";
import { render } from "react-dom";
import { Router, Route, Link, browserHistory } from "react-router";

const App = React.createClass({
  /*...*/
});
const About = React.createClass({
  /*...*/
});
const NoMatch = React.createClass({
  /*...*/
});

const Users = React.createClass({
  render() {
    return (
      <div>
        <h1>Users</h1>
        <div className="master">
          <ul>
            {/* use Link to route around the app */}
            {this.state.users.map((user) => (
              <li key={user.id}>
                <Link to={`/user/${user.id}`}>{user.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="detail">{this.props.children}</div>
      </div>
    );
  },
});

const User = React.createClass({
  componentDidMount() {
    this.setState({
      // route components are rendered with useful information, like URL params
      user: findUserById(this.props.params.userId),
    });
  },

  render() {
    return (
      <div>
        <h2>{this.state.user.name}</h2>
        {/* etc. */}
      </div>
    );
  },
});

// Declarative route configuration (could also load this config lazily
// instead, all you really need is a single root route, you don't need to
// colocate the entire config).
render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="about" component={About} />
      <Route path="users" component={Users}>
        <Route path="/user/:userId" component={User} />
      </Route>
      <Route path="*" component={NoMatch} />
    </Route>
  </Router>,
  document.getElementById("root")
);
```

See more in the [Introduction](/docs/Introduction.md), [Guides](/docs/guides/README.md), and [Examples](/examples).

### Versioning and Stability

We want React Router to be a stable dependency that’s easy to keep current. We take the same approach to versioning as React.js itself: [React Versioning Scheme](https://facebook.github.io/react/blog/2016/02/19/new-versioning-scheme.html).

### Thanks

Thanks to [our sponsors](/SPONSORS.md) for supporting the development of
React Router.

React Router was initially inspired by Ember's fantastic router. Many thanks to the Ember team.

Also, thanks to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to run our build in real browsers.

[npm-badge]: https://img.shields.io/npm/v/@ayc0/react-router-v3.svg?style=flat-square
[npm]: https://www.npmjs.org/package/@ayc0/react-router-v3
