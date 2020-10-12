import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";
import App from "./app";
import CreateEvents from "./createevents";
import CreateRes from "./createres";

function MenuNavigator() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route exact path="/createevents">
          <CreateEvents />
        </Route>
        <Route exact path="/createres">
          <CreateRes />
        </Route>
      </Switch>
    </Router>
  );
}

ReactDOM.render(
  <BrowserRouter>
    <MenuNavigator />
  </BrowserRouter>,
  document.getElementById("root")
);
