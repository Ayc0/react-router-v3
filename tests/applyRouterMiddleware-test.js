import expect from "expect";
import React, { cloneElement } from "react";
import { createRoot } from "react-dom/client";
import Router from "../modules/Router";
import Route from "../modules/Route";
import createMemoryHistory from "../modules/createMemoryHistory";
import applyMiddleware from "../modules/applyRouterMiddleware";
import shouldWarn from "./shouldWarn";

const FOO_ROOT_CONTAINER_TEXT = "FOO ROOT CONTAINER";
const FooContext = React.createContext();
const FooRootContainer = ({ children }) => {
  return (
    <FooContext.Provider value={FOO_ROOT_CONTAINER_TEXT}>
      {children}
    </FooContext.Provider>
  );
};
const FooContainer = ({ children, ...props }) => {
  const fooFromContext = React.useContext(FooContext);
  return cloneElement(children, { ...props, fooFromContext });
};
const useFoo = () => ({
  renderRouterContext: (child) => <FooRootContainer>{child}</FooRootContainer>,
  renderRouteComponent: (child) => <FooContainer>{child}</FooContainer>,
});

const BAR_ROOT_CONTAINER_TEXT = "BAR ROOT CONTAINER";
const BarContext = React.createContext();
const BarRootContainer = ({ children }) => {
  return (
    <BarContext.Provider value={BAR_ROOT_CONTAINER_TEXT}>
      {children}
    </BarContext.Provider>
  );
};
const BarContainer = ({ children, ...props }) => {
  const barFromContext = React.useContext(BarContext);
  return cloneElement(children, { ...props, barFromContext });
};
const useBar = () => ({
  renderRouterContext: (child) => <BarRootContainer>{child}</BarRootContainer>,
  renderRouteComponent: (child) => <BarContainer>{child}</BarContainer>,
});

const BAZ_CONTAINER_TEXT = "BAZ INJECTED";
const useBaz = (bazInjected) => ({
  renderRouteComponent: (child) => cloneElement(child, { bazInjected }),
});

const run = ({ renderWithMiddleware, Component }, assertion) => {
  const div = document.createElement("div");
  const routes = <Route path="/" component={Component} />;
  const root = createRoot(div);
  root.render(
    <div
      ref={(node) => {
        assertion(node.innerHTML);
      }}
    >
      <Router
        render={renderWithMiddleware}
        routes={routes}
        history={createMemoryHistory("/")}
      />
    </div>
  );
};

describe("applyMiddleware", () => {
  it("applies one middleware", (done) => {
    run(
      {
        renderWithMiddleware: applyMiddleware(useFoo()),
        Component: (props) => <div>{props.fooFromContext}</div>,
      },
      (html) => {
        expect(html).toContain(FOO_ROOT_CONTAINER_TEXT);
        done();
      }
    );
  });

  it("applies more than one middleware", (done) => {
    run(
      {
        renderWithMiddleware: applyMiddleware(useBar(), useFoo()),
        Component: (props) => (
          <div>
            {props.fooFromContext} {props.barFromContext}
          </div>
        ),
      },
      (html) => {
        expect(html).toContain(FOO_ROOT_CONTAINER_TEXT);
        expect(html).toContain(BAR_ROOT_CONTAINER_TEXT);
        done();
      }
    );
  });

  it("applies more middleware with only `getContainer`", (done) => {
    run(
      {
        renderWithMiddleware: applyMiddleware(
          useBar(),
          useFoo(),
          useBaz(BAZ_CONTAINER_TEXT)
        ),
        Component: (props) => (
          <div>
            {props.fooFromContext}
            {props.barFromContext}
            {props.bazInjected}
          </div>
        ),
      },
      (html) => {
        expect(html).toContain(FOO_ROOT_CONTAINER_TEXT);
        expect(html).toContain(BAR_ROOT_CONTAINER_TEXT);
        expect(html).toContain(BAZ_CONTAINER_TEXT);
        done();
      }
    );
  });

  it("applies middleware that only has `getContainer`", (done) => {
    run(
      {
        renderWithMiddleware: applyMiddleware(useBaz(BAZ_CONTAINER_TEXT)),
        Component: (props) => <div>{props.bazInjected}</div>,
      },
      (html) => {
        expect(html).toContain(BAZ_CONTAINER_TEXT);
        done();
      }
    );
  });

  it("should warn on invalid middleware", () => {
    shouldWarn("at index 0 does not appear to be a valid");
    shouldWarn("at index 2 does not appear to be a valid");

    applyMiddleware({}, { renderRouterContext: () => {} }, {});
  });
});
