import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

// Redux
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

/**
 * @function styles
 * @memberof signup
 * @description Určuje CSS pro daný komponent.
 * @param {Object} theme - Theme (CSS) celé aplikace.
 */
const styles = theme => ({
  ...theme.loginAndSignup
});
/**
 * @class signup
 * @extends Component
 * @category Pages
 * @classdesc Na této stránce se uživatel může zaregistrovat. Pro registraci vyplní do formuláře email, uživatelské jméno, heslo a potvrzení hesla.
 * @property {Object} state - Vnitřní state komponentu.
 * @property {string} state.email - Text, který uživatel zadá do formuláře do políčka pro email.
 * @property {string} state.password - Text, který uživatel zadá do formuláře do políčka pro heslo.
 * @property {string} state.confirmPassword - Text, který uživatel zadá do formuláře do políčka pro potvrzení hesla.
 * @property {string} state.username - Text, který uživatel zadá do formuláře do políčka pro uživatelské jméno.
 *
 * @requires userActions~signupUser
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 */
export class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      username: ""
    };
  }

  /**
   * @function handleSubmit
   * @memberOf signup
   * @description Zavolá funkci pro zaregistrování uživatele.
   * @param {event} event - Event, který vyvolal spuštění této funkce.
   */
  handleSubmit = event => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      username: this.state.username
    };
    this.props.signupUser(userData, this.props.history);
  };

  /**
   * @function handleChange
   * @memberOf signup
   * @description Přepisuje data v state tohoto komponentu na základě změn v textových polích formuláře.
   * @param {event} event - Event, který vyvolal spuštění této funkce.
   */
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  /**
   * @function componentWillUnmount
   * @memberOf signup
   * @description Vymaže status aplikace v reduceru.
   */
  componentWillUnmount() {
    this.props.clearStatus();
  }

  render() {
    const {
      classes,
      uiStatus: { status, errorCodes }
    } = this.props;
    return (
      <div className="rootContainer">
        <Grid container className={classes.form} justify="center">
          <Grid item sm={8} md={5} lg={4} xl={3}>
            <Paper>
              <div style={{ padding: "15px 15px 15px 15px" }}>
                <Typography variant="h2" className={classes.pageTitle}>
                  Signup
                </Typography>
                <form noValidate onSubmit={this.handleSubmit}>
                  <TextField
                    id="username"
                    name="username"
                    type="text"
                    label="Username"
                    className={classes.textField}
                    helperText={
                      errorCodes.includes("auth/username-already-exists")
                        ? "This username is already taken!"
                        : errorCodes.includes("auth/invalid-username")
                        ? "Must be a valid username!"
                        : ""
                    }
                    error={errorCodes.includes("auth/username-already-exists") ? true : errorCodes.includes("auth/invalid-username") ? true : false}
                    value={this.state.username}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    className={classes.textField}
                    helperText={
                      errorCodes.includes("auth/invalid-email")
                        ? "Must be a valid email!"
                        : errorCodes.includes("auth/email-already-in-use")
                        ? "This email is already in use!"
                        : ""
                    }
                    error={errorCodes.includes("auth/invalid-email") ? true : errorCodes.includes("auth/email-already-in-use") ? true : false}
                    value={this.state.email}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    className={classes.textField}
                    helperText={
                      errorCodes.includes("auth/invalid-password")
                        ? "Must be a valid password!"
                        : errorCodes.includes("auth/weak-password")
                        ? "Weak password! Passwords must be at least 6 characters long!"
                        : errorCodes.includes("auth/passwords-dont-match")
                        ? "Passwords don't match!"
                        : ""
                    }
                    error={errorCodes.includes("auth/invalid-password") ? true : errorCodes.includes("auth/passwords-dont-match") ? true : false}
                    value={this.state.password}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    className={classes.textField}
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={status == "BUSY" ? true : false}>
                    Signup
                    {status == "BUSY" && <CircularProgress size={30} className={classes.progress} />}
                  </Button>
                  <br />
                  <small>
                    Already have an account? Log in <Link to="/login">here</Link>.
                  </small>
                </form>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
  clearStatus: PropTypes.func.isRequired,
  uiStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  signupUser,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(signup));
