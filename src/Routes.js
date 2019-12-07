import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import AppliedRoute from './components/AppliedRoute';
import Signup from './containers/Signup';
import NewEvent from './containers/NewEvent';

export default function Routes({ appProps }) {
  return (
    <Switch>
      <AppliedRoute path="/" exact component={Home} appProps={appProps} />
      <AppliedRoute path="/login" exact component={Login} appProps={appProps} />
      <AppliedRoute
        path="/signup"
        exact
        component={Signup}
        appProps={appProps}
      />
      <AppliedRoute
        path="/events/new"
        exact
        component={NewEvent}
        appProps={appProps}
      />
      <Route component={NotFound} />
    </Switch>
  );
}
