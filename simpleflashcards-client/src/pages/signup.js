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

const styles = theme => ({
  ...theme.loginAndSignup
});

export class signup extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      email: "",
      password: "",
      confirmPassword: "",
      username: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

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

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // TODO prepsat errory na jiny jmena erroru (ty co mam v cloud functions)

  render() {
    const {
      classes,
      UI: { loading }
    } = this.props;
    const { errors } = this.state;
    return (
      <div className="rootContainer">
        <Grid container className={classes.form} justify="center">
          <Grid item sm={5} lg={4} xl={3}>
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
                    helperText={errors.usernameError}
                    error={errors.usernameError ? true : false}
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
                    helperText={errors.emailError}
                    error={errors.emailError ? true : false}
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
                    helperText={errors.passwordError}
                    error={errors.passwordError ? true : false}
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
                  {errors.err && (
                    <Typography variant="body2" className={classes.customError}>
                      {errors.err}
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    disabled={loading}
                  >
                    Signup
                    {loading && (
                      <CircularProgress
                        size={30}
                        className={classes.progress}
                      />
                    )}
                  </Button>
                  <br />
                  <small>
                    Already have an account? Log in{" "}
                    <Link to="/login">here</Link>.
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
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  signupUser
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(signup));
