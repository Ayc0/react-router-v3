import expect from "expect";
import React from "react";
import { render } from "@testing-library/react";
import createHistory from "../modules/createMemoryHistory";
import IndexRedirect from "../modules/IndexRedirect";
import Router from "../modules/Router";
import Route from "../modules/Route";

describe("An <IndexRedirect>", function () {
  it("works", function () {
    const history = createHistory("/");
    render(
      <Router history={history}>
        <Route path="/">
          <IndexRedirect to="/messages" />
          <Route path="messages" />
        </Route>
      </Router>
    );
    expect(history.getCurrentLocation().pathname).toEqual("/messages");
  });
});
