import expect from "expect";
import React from "react";
import { render } from "@testing-library/react";

import match from "../modules/match";
import RouterContext, { routerContext } from "../modules/RouterContext";
import { createRouterObject } from "../modules/RouterUtils";

describe("RouterContext", function () {
  let context, history, transitionManager, router;
  let listenBeforeLeavingRouteSentinel, isActiveSentinel, createHrefSentinel;

  beforeEach(function () {
    listenBeforeLeavingRouteSentinel = {};
    isActiveSentinel = {};
    createHrefSentinel = {};

    history = {
      push: expect.createSpy(),
      replace: expect.createSpy(),
      createHref: expect.createSpy().andReturn(createHrefSentinel),
      go: expect.createSpy(),
      goBack: expect.createSpy(),
      goForward: expect.createSpy(),
    };
    transitionManager = {
      listenBeforeLeavingRoute: expect
        .createSpy()
        .andReturn(listenBeforeLeavingRouteSentinel),
      isActive: expect.createSpy().andReturn(isActiveSentinel),
    };

    router = createRouterObject(history, transitionManager, {});
  });

  function renderTest(done) {
    class Component extends React.Component {
      static contextType = routerContext;

      render() {
        context = { router: this.context };
        return null;
      }
    }
    const routes = { path: "/", component: Component };

    match({ location: "/", routes }, (err, redirect, renderProps) => {
      render(
        <RouterContext {...renderProps} history={history} router={router} />
      );
      done();
    });
  }

  it("exports a `router` object to routing context", (done) => {
    renderTest(() => {
      expect(context.router).toExist();
      done();
    });
  });

  it("injects a `router` object into props of route components", (done) => {
    class RoutedComponent extends React.Component {
      render() {
        expect(this.props.router).toBeA(Object);
        return null;
      }
    }

    match(
      { location: "/", routes: { path: "/", component: RoutedComponent } },
      (err, redirect, renderProps) => {
        render(
          <RouterContext {...renderProps} history={history} router={router} />
        );
        done();
      }
    );
  });

  describe("some weird tests that test implementation and should probably go away", () => {
    it("proxies calls to `push` to `props.history`", (done) => {
      const args = [1, 2, 3];
      renderTest(() => {
        context.router.push(...args);
        expect(history.push).toHaveBeenCalledWith(...args);
        done();
      });
    });

    it("proxies calls to `replace` to `props.history`", (done) => {
      const args = [1, 2, 3];
      renderTest(() => {
        context.router.replace(...args);
        expect(history.replace).toHaveBeenCalledWith(...args);
        done();
      });
    });

    it("proxies calls to `setRouteLeaveHook` to `props.transitionManager`", (done) => {
      const args = [1, 2, 3];
      renderTest(() => {
        const remove = context.router.setRouteLeaveHook(...args);
        expect(transitionManager.listenBeforeLeavingRoute).toHaveBeenCalledWith(
          ...args
        );
        expect(remove).toBe(listenBeforeLeavingRouteSentinel);
        done();
      });
    });

    it("proxies calls to `isActive` to `props.transitionManager`", (done) => {
      const args = [1, 2, 3];
      renderTest(() => {
        const isActive = context.router.isActive(...args);
        expect(transitionManager.isActive).toHaveBeenCalledWith(...args);
        expect(isActive).toBe(isActiveSentinel);
        done();
      });
    });

    it("proxies calls to `createHref` to `props.history`", (done) => {
      const args = [1, 2, 3];
      renderTest(() => {
        const href = context.router.createHref(...args);
        expect(history.createHref).toHaveBeenCalledWith(...args);
        expect(href).toBe(createHrefSentinel);
        done();
      });
    });

    it("proxies calls to `go` to `props.history`", (done) => {
      const args = [1, 2, 3];
      renderTest(() => {
        context.router.go(...args);
        expect(history.go).toHaveBeenCalledWith(...args);
        done();
      });
    });

    it("proxies calls to `goBack` to `props.history`", (done) => {
      const args = [1, 2, 3];
      renderTest(() => {
        context.router.goBack(...args);
        expect(history.goBack).toHaveBeenCalledWith(...args);
        done();
      });
    });

    it("proxies calls to `goForward` to `props.history`", (done) => {
      const args = [1, 2, 3];
      renderTest(() => {
        context.router.goForward(...args);
        expect(history.goForward).toHaveBeenCalledWith(...args);
        done();
      });
    });
  });
});