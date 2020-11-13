import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import CreateEvents from '~/pages/CreateEvents';
import CreateResources from '~/pages/CreateResources';
import EventDetails from '~/pages/EventDetails';
import Home from '~/pages/Home';
import ResourceDetails from '~/pages/ResourceDetails';

const Routes = () => (
  <Switch>
    <Route exact path='/' component={Home} />
    <Route path='/createevents'>
      <CreateEvents />
    </Route>
    <Route path='/createres'>
      <CreateResources />
    </Route>
    <Route path='/eventdetails'>
      <EventDetails />
    </Route>
    <Route path='/resdetails'>
      <ResourceDetails />
    </Route>
    <Redirect to='/' />
  </Switch>
);

export default Routes;
