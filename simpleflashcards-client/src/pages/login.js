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
import { loginUser } from "../redux/actions/userActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

/**
 * @function styles
 * @memberof login
 * @description Určuje CSS pro daný komponent.
 * @param {Object} theme - Theme (CSS) celé aplikace.
 */
const styles = theme => ({
  ...theme.loginAndSignup
});
/**
 * @class login
 * @extends Component
 * @category Pages
 * @classdesc Na této stránce se uživatel může přihlásit pomocí emailu a hesla.
 * @property {Object} state - Vnitřní state komponentu.
 * @property {string} state.email - Text, který uživatel zadá do formuláře do políčka pro email.
 * @property {string} state.password - Text, který uživatel zadá do formuláře do políčka pro heslo.
 *
 * @requires userActions~loginUser
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 */
export class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: ""
    };
  }

  /**
   * @function handleSubmit
   * @memberOf login
   * @description Zavolá funkci pro přihlášení uživatele.
   * @param {event} event - Event, který vyvolal spuštění této funkce.
   */
  handleSubmit = event => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData, this.props.history);
  };

  /**
   * @function handleChange
   * @memberOf login
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
   * @memberOf login
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
                  Login
                </Typography>
                <form noValidate onSubmit={this.handleSubmit}>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    className={classes.textField}
                    helperText={
                      errorCodes.includes("auth/invalid-email")
                        ? "Must be a valid email adress!"
                        : errorCodes.includes("auth/user-not-found")
                        ? "User not found!"
                        : ""
                    }
                    error={errorCodes.includes("auth/invalid-email") ? true : errorCodes.includes("auth/user-not-found") ? true : false}
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
                    helperText={errorCodes.includes("auth/wrong-password") ? "Wrong password!" : ""}
                    error={errorCodes.includes("auth/wrong-password") ? true : false}
                    value={this.state.password}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={status === "BUSY" ? true : false}>
                    Login
                    {status === "BUSY" && <CircularProgress size={30} className={classes.progress} />}
                  </Button>
                  <br />
                  <small>
                    Don't have an account? Sign up <Link to="/signup">here</Link>.
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

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  clearStatus: PropTypes.func.isRequired,
  uiStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  loginUser,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login));
