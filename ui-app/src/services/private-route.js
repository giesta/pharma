import React from 'react';

import { Route, Redirect } from "react-router-dom";

import AuthService from "./auth.service";

export default function PrivateRoute({ component: Component, roles, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
           AuthService.getCurrentUser()!==null && roles.some(cred=> cred === AuthService.getCurrentUser().user.role) ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }