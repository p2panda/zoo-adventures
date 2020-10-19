import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import CreateEvents from "./pages/createevents";
import CreateRes from "./pages/createres";
import Home from "./pages/home";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/createevents">
      <CreateEvents />
    </Route>
    <Route path="/createres">
      <CreateRes />
    </Route>
    <Redirect to="/" />
  </Switch>
);

export default Routes;
