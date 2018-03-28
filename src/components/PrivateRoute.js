import React from 'react';
import {Route, Redirect} from 'react-router-dom'
import {LOGIN_PATH} from "../paths";

// Route wrapper with authentication check
export const PrivateRoute = ({ component, isAuthenticated, ...rest }) => (
  <Route {...rest} render={ props => (
    isAuthenticated() ? (
        React.createElement(component, props)
      ) : (
        <Redirect to={{
          pathname: LOGIN_PATH,
          state: {from: props.location}
        }}/>
      )
  )}/>
);
