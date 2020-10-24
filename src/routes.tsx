import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import CreateEvents from "./pages/createevents";
import CreateRes from "./pages/createres";
import EventDetails from "./pages/eventdetails";
import Home from "./pages/home";
import ResDetails from "./pages/resdetails";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/createevents">
      <CreateEvents />
    </Route>
    <Route path="/createres">
      <CreateRes />
    </Route>
    <Route path="/eventdetails">
      <EventDetails />
    </Route>
    <Route path="/resdetails">
      <ResDetails />
    </Route>
    <Redirect to="/" />
  </Switch>
);

export default Routes;
