import React from "react";
import { Route, Redirect } from "react-router-dom";

// Zdroj https://www.youtube.com/watch?v=vzkGTZFjbiE&list=PLMhAeHCz8S38ryyeMiBPPUnFAiWnoPvWP&index=17
const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authenticated === true ? (
        <Redirect to="/"></Redirect>
      ) : (
        <Component {...props} />
      )
    }
  />
);

export default AuthRoute;
