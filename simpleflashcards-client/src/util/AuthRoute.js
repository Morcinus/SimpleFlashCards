import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

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

AuthRoute.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(AuthRoute);
