import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

/**
 * @module PrivateRoute
 * @category util
 * @description Toto je React Route pro stránky, na kterých je třeba, aby byl uživatel přihlášen. Pokud není přihlášen, bude přesměrován na /login.
 */

/**
 * @const PrivateRoute
 * @description Toto je React Route pro stránky, na kterých je třeba, aby byl uživatel přihlášen. Pokud není přihlášen, bude přesměrován na /login.
 * @requires {@link module:store~reducers module:store~reducers.user}
 */

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route {...rest} render={props => (authenticated === true ? <Component {...props} /> : <Redirect to="/login"></Redirect>)} />
);

PrivateRoute.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(PrivateRoute);
