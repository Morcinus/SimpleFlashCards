import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

/**
 * @module AuthRoute
 * @category util
 * @description Pokud je uživatel přihlášen a dostane se na "/login" nebo "/signup" stránku, automaticky ho přesměruje na "/home".
 */

/**
 * @const AuthRoute
 * @description Pokud je uživatel přihlášen a dostane se na "/login" nebo "/signup" stránku, automaticky ho přesměruje na "/home".
 * @requires {@link module:store~reducers module:store~reducers.user}
 */
// Zdroj: https://www.youtube.com/watch?v=vzkGTZFjbiE&list=PLMhAeHCz8S38ryyeMiBPPUnFAiWnoPvWP&index=17
const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route {...rest} render={props => (authenticated === true ? <Redirect to="/home"></Redirect> : <Component {...props} />)} />
);

AuthRoute.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(AuthRoute);
