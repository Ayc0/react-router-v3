import expect, { spyOn } from "expect";
import React, { Component } from "react";
import { render } from "@testing-library/react";
import createHistory from "../modules/createMemoryHistory";
import hashHistory from "../modules/hashHistory";
import Router from "../modules/Router";
import Route from "../modules/Route";
import Link from "../modules/Link";
import execSteps from "./execSteps";

describe("A <Link>", () => {
  const Hello = ({ params }) => <div>Hello {params.name}!</div>;

  const Goodbye = () => <div>Goodbye</div>;

  it('should not render unnecessary class=""', () => {
    render(<Link to="/something" />);
    const a = document.querySelector("a");
    expect(a.hasAttribute("class")).toBe(false);
  });

  it("knows how to make its href", () => {
    const LinkWrapper = () => (
      <Link
        to={{
          pathname: "/hello/michael",
          query: { the: "query" },
          hash: "#the-hash",
        }}
      >
        Link
      </Link>
    );

    render(
      <Router history={createHistory("/")}>
        <Route path="/" component={LinkWrapper} />
      </Router>
    );
    const a = document.querySelector("a");
    expect(a.getAttribute("href")).toEqual("/hello/michael?the=query#the-hash");
  });

  it("exposes its ref via an innerRef prop", function (done) {
    const refCallback = (n) => {
      if (!n) {
        return;
      }
      expect(n.tagName).toEqual("A");
      done();
    };

    render(
      <Link to="/something" innerRef={refCallback}>
        Link
      </Link>
    );
  });

  describe("with hash history", () => {
    it("should know how to make its href", () => {
      const LinkWrapper = () => (
        <Link to={{ pathname: "/hello/michael", query: { the: "query" } }}>
          Link
        </Link>
      );

      render(
        <Router history={hashHistory}>
          <Route path="/" component={LinkWrapper} />
        </Router>
      );
      const a = document.querySelector("a");
      expect(a.getAttribute("href")).toEqual("#/hello/michael?the=query");
    });
  });

  describe("with params", () => {
    const App = () => (
      <div>
        <Link to="/hello/michael" activeClassName="active">
          Michael
        </Link>
        <Link
          to={{ pathname: "/hello/ryan", query: { the: "query" } }}
          activeClassName="active"
        >
          Ryan
        </Link>
      </div>
    );

    it("is active when its params match", () => {
      render(
        <Router history={createHistory("/hello/michael")}>
          <Route path="/" component={App}>
            <Route path="hello/:name" component={Hello} />
          </Route>
        </Router>
      );
      const a = document.querySelectorAll("a")[0];
      expect(a.className.trim()).toEqual("active");
    });

    it("is not active when its params do not match", () => {
      render(
        <Router history={createHistory("/hello/michael")}>
          <Route path="/" component={App}>
            <Route path="hello/:name" component={Hello} />
          </Route>
        </Router>
      );
      const a = document.querySelectorAll("a")[1];
      expect(a.className.trim()).toEqual("");
    });

    it("is active when its params and query match", () => {
      render(
        <Router history={createHistory("/hello/ryan?the=query")}>
          <Route path="/" component={App}>
            <Route path="hello/:name" component={Hello} />
          </Route>
        </Router>
      );
      const a = document.querySelectorAll("a")[1];
      expect(a.className.trim()).toEqual("active");
    });

    it("is not active when its query does not match", () => {
      render(
        <Router history={createHistory("/hello/ryan?the=other+query")}>
          <Route path="/" component={App}>
            <Route path="hello/:name" component={Hello} />
          </Route>
        </Router>
      );
      const a = document.querySelectorAll("a")[1];
      expect(a.className.trim()).toEqual("");
    });
  });

  describe("when its route is active and className is empty", () => {
    it("it shouldn't have an active class", (done) => {
      const LinkWrapper = ({ children }) => (
        <div>
          <Link to="/hello" className="dontKillMe" activeClassName="">
            Link
          </Link>
          {children}
        </div>
      );

      const history = createHistory("/goodbye");

      let a;
      const steps = [
        () => {
          a = document.querySelector("a");
          expect(a.className).toEqual("dontKillMe");
          history.push("/hello");
        },
        () => {
          expect(a.className).toEqual("dontKillMe");
        },
      ];

      const execNextStep = execSteps(steps, done);

      render(
        <Router history={history} onUpdate={execNextStep}>
          <Route path="/" component={LinkWrapper}>
            <Route path="goodbye" component={Goodbye} />
            <Route path="hello" component={Hello} />
          </Route>
        </Router>
      );
    });
  });

  describe("when its route is active", () => {
    it("has its activeClassName", (done) => {
      const LinkWrapper = ({ children }) => (
        <div>
          <Link to="/hello" className="dontKillMe" activeClassName="highlight">
            Link
          </Link>
          {children}
        </div>
      );

      let a;
      const history = createHistory("/goodbye");
      const steps = [
        () => {
          a = document.querySelector("a");
          expect(a.className).toEqual("dontKillMe");
          history.push("/hello");
        },
        () => {
          expect(a.className).toEqual("dontKillMe highlight");
        },
      ];

      const execNextStep = execSteps(steps, done);

      render(
        <Router history={history} onUpdate={execNextStep}>
          <Route path="/" component={LinkWrapper}>
            <Route path="goodbye" component={Goodbye} />
            <Route path="hello" component={Hello} />
          </Route>
        </Router>
      );
    });

    it("has its activeStyle", (done) => {
      const LinkWrapper = ({ children }) => (
        <div>
          <Link
            to="/hello"
            style={{ color: "white" }}
            activeStyle={{ color: "red" }}
          >
            Link
          </Link>
          {children}
        </div>
      );

      let a;
      const history = createHistory("/goodbye");
      const steps = [
        () => {
          a = document.querySelector("a");
          expect(a.style.color).toEqual("white");
          history.push("/hello");
        },
        () => {
          expect(a.style.color).toEqual("red");
        },
      ];

      const execNextStep = execSteps(steps, done);

      render(
        <Router history={history} onUpdate={execNextStep}>
          <Route path="/" component={LinkWrapper}>
            <Route path="hello" component={Hello} />
            <Route path="goodbye" component={Goodbye} />
          </Route>
        </Router>
      );
    });
  });

  describe("when route changes", () => {
    it("changes active state", (done) => {
      const LinkWrapper = ({ children }) => (
        <div>
          <Link to="/hello" activeClassName="active">
            Link
          </Link>
          {children}
        </div>
      );

      let a;
      const history = createHistory("/goodbye");
      const steps = [
        () => {
          a = document.querySelector("a");
          expect(a.className).toEqual("");
          history.push("/hello");
        },
        () => {
          expect(a.className).toEqual("active");
        },
      ];

      const execNextStep = execSteps(steps, done);

      render(
        <Router history={history} onUpdate={execNextStep}>
          <Route path="/" component={LinkWrapper}>
            <Route path="goodbye" component={Goodbye} />
            <Route path="hello" component={Hello} />
          </Route>
        </Router>
      );
    });

    it("changes active state inside static containers", (done) => {
      class LinkWrapper extends Component {
        shouldComponentUpdate() {
          return false;
        }

        render() {
          return (
            <div>
              <Link to="/hello" activeClassName="active">
                Link
              </Link>
              {this.props.children}
            </div>
          );
        }
      }

      let a;
      const history = createHistory("/goodbye");
      const steps = [
        () => {
          a = document.querySelector("a");
          expect(a.className).toEqual("");
          history.push("/hello");
        },
        () => {
          expect(a.className).toEqual("active");
        },
      ];

      const execNextStep = execSteps(steps, done);

      render(
        <Router history={history} onUpdate={execNextStep}>
          <Route path="/" component={LinkWrapper}>
            <Route path="goodbye" component={Goodbye} />
            <Route path="hello" component={Hello} />
          </Route>
        </Router>
      );
    });
  });

  describe("when clicked", () => {
    it("calls a user defined click handler", (done) => {
      class LinkWrapper extends Component {
        handleClick() {
          done();
        }

        render() {
          return (
            <Link to="/hello" onClick={this.handleClick}>
              Link
            </Link>
          );
        }
      }

      render(
        <Router history={createHistory("/")}>
          <Route path="/" component={LinkWrapper} />
          <Route path="/hello" component={Hello} />
        </Router>
      );
      document.querySelector("a").click();
    });

    it("transitions to the correct route for string", (done) => {
      const LinkWrapper = () => <Link to="/hello?the=query#hash">Link</Link>;

      const history = createHistory("/");
      const spy = spyOn(history, "push").andCallThrough();

      const node = document.createElement("div");

      const steps = [
        () => {
          const anchor = node.querySelector("a");
          console.log("anchor", anchor);
          anchor.click();
        },
        ({ location }) => {
          expect(node.innerHTML).toMatch(/Hello/);
          expect(spy).toHaveBeenCalled();

          expect(location.pathname).toEqual("/hello");
          expect(location.search).toEqual("?the=query");
          expect(location.hash).toEqual("#hash");
        },
      ];

      const execNextStep = execSteps(steps, done);

      render(
        <Router history={history} onUpdate={execNextStep}>
          <Route path="/" component={LinkWrapper} />
          <Route path="/hello" component={Hello} />
        </Router>,
        { container: node }
      );
    });

    it("transitions to the correct route for object", (done) => {
      const LinkWrapper = () => (
        <Link
          to={{
            pathname: "/hello",
            query: { how: "are" },
            hash: "#world",
            state: { you: "doing?" },
          }}
        >
          Link
        </Link>
      );

      const history = createHistory("/");
      const spy = spyOn(history, "push").andCallThrough();

      const node = document.createElement("div");

      const steps = [
        () => {
          node.querySelector("a").click();
        },
        ({ location }) => {
          expect(node.innerHTML).toMatch(/Hello/);
          expect(spy).toHaveBeenCalled();

          expect(location.pathname).toEqual("/hello");
          expect(location.search).toEqual("?how=are");
          expect(location.hash).toEqual("#world");
          expect(location.state).toEqual({ you: "doing?" });
        },
      ];

      const execNextStep = execSteps(steps, done);

      render(
        <Router history={history} onUpdate={execNextStep}>
          <Route path="/" component={LinkWrapper} />
          <Route path="/hello" component={Hello} />
        </Router>,
        { container: node }
      );
    });

    it("does not transition when onClick prevents default", (done) => {
      class LinkWrapper extends Component {
        handleClick(event) {
          event.preventDefault();
        }

        render() {
          return (
            <Link to="/hello" onClick={this.handleClick}>
              Link
            </Link>
          );
        }
      }

      const history = createHistory("/");
      const spy = spyOn(history, "push").andCallThrough();

      const node = document.createElement("div");

      const steps = [
        () => {
          node.querySelector("a").click();
        },
        () => {
          expect(node.innerHTML).toMatch(/Link/);
          expect(spy).toNotHaveBeenCalled();
        },
      ];

      const execNextStep = execSteps(steps, done);

      render(
        <Router history={history} onUpdate={execNextStep}>
          <Route path="/" component={LinkWrapper} />
          <Route path="/hello" component={Hello} />
        </Router>,
        { container: node }
      );
      execNextStep();
    });
  });

  describe("with function to", () => {
    const LinkWrapper = () => (
      <Link
        to={(location) => ({ ...location, hash: "#hash" })}
        activeClassName="active"
      >
        Link
      </Link>
    );

    it("should have the correct href and active state", () => {
      render(
        <Router history={createHistory("/hello")}>
          <Route path="/hello" component={LinkWrapper} />
        </Router>
      );
      const a = document.querySelector("a");
      expect(a.getAttribute("href")).toEqual("/hello#hash");
      expect(a.className.trim()).toEqual("active");
    });

    it("should transition correctly on click", (done) => {
      const steps = [
        () => {
          document.querySelector("a").click();
        },
        ({ location }) => {
          expect(location.pathname).toEqual("/hello");
          expect(location.hash).toEqual("#hash");
        },
      ];

      const execNextStep = execSteps(steps, done);

      render(
        <Router history={createHistory("/hello")} onUpdate={execNextStep}>
          <Route path="/hello" component={LinkWrapper} />
        </Router>
      );
    });
  });

  describe('when the "to" prop is unspecified', function () {
    class App extends Component {
      render() {
        return (
          <div>
            <Link>Blank Link</Link>
            <Link />
            <Link className="kitten-link">Kittens</Link>
          </div>
        );
      }
    }

    it("returns an anchor tag without an href", function () {
      render(
        <Router history={createHistory("/")}>
          <Route path="/" component={App} />
        </Router>
      );
      const link1 = document.querySelectorAll("a")[0];
      const link2 = document.querySelectorAll("a")[1];
      const link3 = document.querySelectorAll("a")[2];
      expect(link1.href).toEqual("");
      expect(link2.href).toEqual("");
      expect(link3.href).toEqual("");
    });

    it("exposes its ref via an innerRef prop", function (done) {
      const refCallback = (n) => {
        if (!n) {
          return;
        }
        expect(n.tagName).toEqual("A");
        done();
      };

      const LinkWrapper = () => <Link innerRef={refCallback}>Link</Link>;

      render(
        <Router history={createHistory("/")}>
          <Route path="/" component={LinkWrapper} />
        </Router>
      );
    });

    it("passes down other props", function () {
      render(
        <Router history={createHistory("/")}>
          <Route path="/" component={App} />
        </Router>
      );
      const link3 = document.querySelectorAll("a")[2];
      expect(link3.className).toEqual("kitten-link");
    });
  });
});
