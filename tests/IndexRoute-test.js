import expect from "expect";
import React, { Component } from "react";
import { render } from "@testing-library/react";
import createHistory from "../modules/createMemoryHistory";
import IndexRoute from "../modules/IndexRoute";
import Router from "../modules/Router";
import Route from "../modules/Route";

describe("An <IndexRoute>", function () {
  class Parent extends Component {
    render() {
      return <div>parent {this.props.children}</div>;
    }
  }

  class Child extends Component {
    render() {
      return <div>child</div>;
    }
  }

  it("renders when its parent's URL matches exactly", function () {
    const node = document.createElement("div");
    render(
      <Router history={createHistory("/")}>
        <Route path="/" component={Parent}>
          <IndexRoute component={Child} />
        </Route>
      </Router>,
      { container: node }
    );
    expect(node.textContent).toEqual("parent child");
  });

  describe("nested deeply in the route hierarchy", function () {
    it("renders when its parent's URL matches exactly", function () {
      const node = document.createElement("div");
      render(
        <Router history={createHistory("/test")}>
          <Route path="/" component={Parent}>
            <IndexRoute component={Child} />
            <Route path="/test" component={Parent}>
              <IndexRoute component={Child} />
            </Route>
          </Route>
        </Router>,
        { container: node }
      );
      expect(node.textContent).toEqual("parent parent child");
    });

    it("renders when its parents combined pathes match", function () {
      const node = document.createElement("div");
      render(
        <Router history={createHistory("/path/test")}>
          <Route path="/path" component={Parent}>
            <IndexRoute component={Child} />
            <Route path="test" component={Parent}>
              <IndexRoute component={Child} />
            </Route>
          </Route>
        </Router>,
        { container: node }
      );
      expect(node.textContent).toEqual("parent parent child");
    });

    it("renders when its parents combined pathes match, and its direct parent is path less", function () {
      const node = document.createElement("div");
      render(
        <Router history={createHistory("/")}>
          <Route path="/" component={Parent}>
            <Route component={Parent}>
              <Route component={Parent}>
                <Route component={Parent}>
                  <Route path="deep" component={Parent} />
                  <IndexRoute component={Child} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Router>,
        { container: node }
      );
      expect(node.textContent).toEqual("parent parent parent parent child");
    });
  });
});
