import React, { useCallback, useEffect } from 'react';

import { Switch, Route, Redirect } from "react-router-dom";

import AuthService from "./auth.service";

export default function PrivateRoute({ component: Component, roles, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
            roles.some(cred=> cred === AuthService.getCurrentUser().user.role) ? (
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