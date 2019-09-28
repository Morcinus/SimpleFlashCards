import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import axios from "axios";

// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

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
      username: "",
      loading: false
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      username: this.state.username
    };
    this.setState({
      loading: true
    });
    //this.props.loginUser(userData, this.props.history);
    axios
      .post("/signup", userData)
      .then(res => {
        console.log(res.data);
        localStorage.setItem("FBIdToken", `Bearer ${res.data.idToken}`);
        this.setState({ loading: false });
        this.props.history.push("/");
      })
      .catch(err => {
        console.log(err.response.data);
        this.setState({
          errors: err.response.data,
          loading: false
        });
      });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // TODO prepsat errory na jiny jmena erroru (ty co mam v cloud functions)

  render() {
    const { classes } = this.props;
    const { loading, errors } = this.state;
    return (
      <div>
        <Grid container className={classes.form}>
          <Grid item sm />
          <Grid item sm>
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
          <Grid item sm />
        </Grid>
      </div>
    );
  }
}

signup.propTypes = { classes: PropTypes.object.isRequired };

export default withStyles(styles)(signup);
