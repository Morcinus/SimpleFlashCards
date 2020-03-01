import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

/**
 * @module AuthRoute
 * @category util
 * @description React Route, která přesměruje uživatele na "/home", pokud je uživatel přihlášen a dostane se na stránku "/login" nebo "/signup".
 */

/**
 * @function AuthRoute
 * @description React Route, která přesměruje uživatele na "/home", pokud je uživatel přihlášen a dostane se na stránku "/login" nebo "/signup".
 * @param {Object} component - Komponent, který chce uživatel zobrazit.
 * @param {boolean} authenticated - Informace, zda je uživatel přihlášen či ne.
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
