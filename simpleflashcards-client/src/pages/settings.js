import React, { Component } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Lock from "@material-ui/icons/Lock";
import Person from "@material-ui/icons/Person";
import Mail from "@material-ui/icons/Mail";
import Notes from "@material-ui/icons/Notes";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import Input from "@material-ui/core/Input";
import LinearProgress from "@material-ui/core/LinearProgress";

// Redux
import { connect } from "react-redux";
import {
  getUserPersonalData,
  setUserPersonalData,
  resetPassword
} from "../redux/actions/userActions";

export class settings extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      success: {},
      username: "",
      bio: "",
      email: "",
      password: ""
    };
    this.handlePasswordReset = this.handlePasswordReset.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  componentDidMount() {
    this.props.getUserPersonalData();
  }

  componentDidUpdate(prevProps) {
    // User credentials
    if (this.props.user.credentials) {
      if (this.props.user.credentials !== prevProps.user.credentials) {
        this.setState({
          username: this.props.user.credentials.username,
          bio: this.props.user.credentials.bio,
          email: this.props.user.credentials.email
        });
      }
    }

    // Errors
    if (this.props.UI.errors) {
      if (this.props.UI.errors !== prevProps.UI.errors) {
        this.setState({
          errors: this.props.UI.errors,
          success: {} // Sould be done better - nedelat pres state ale rovnou pres props
        });
      }
    }

    // Success
    if (this.props.UI.success) {
      if (this.props.UI.success !== prevProps.UI.success) {
        this.setState({
          errors: {}, // Sould be done better - nedelat pres state ale rovnou pres props
          success: this.props.UI.success
        });
      }
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSave(eventName) {
    let userData = {
      [eventName]: this.state[eventName]
    };

    this.props.setUserPersonalData(userData);
  }

  handlePasswordReset() {
    this.props.resetPassword();
  }

  handleEmailChange() {
    let userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.setUserPersonalData(userData, this.props.history);
    this.setState({
      password: ""
    });
  }

  render() {
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid item sm={6} lg={6} xl={6}>
            <Paper>
              <div style={{ padding: "25px 50px" }}>
                <Typography variant="h5">Settings</Typography>
                <Divider></Divider>

                <br />
                {this.props.UI.loading ? (
                  <LinearProgress color="secondary" />
                ) : (
                  <React.Fragment></React.Fragment>
                )}
                <List
                  subheader={<ListSubheader>Profile Settings</ListSubheader>}
                >
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <TextField
                          label="Username"
                          InputLabelProps={{
                            shrink: true
                          }}
                          onChange={this.handleChange}
                          name="username"
                          value={this.state.username}
                          helperText={
                            this.state.success.usernameSuccess != null
                              ? this.state.success.usernameSuccess
                              : this.state.errors.usernameError
                              ? this.state.errors.usernameError
                              : ""
                          }
                        />
                      }
                    ></ListItemText>

                    <ListItemSecondaryAction>
                      <Button
                        color="secondary"
                        variant="contained"
                        disabled={
                          this.state.username ===
                          this.props.user.credentials.username
                        }
                        onClick={() => this.handleSave("username")}
                      >
                        Save
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Notes />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <TextField
                          label="Profile Description"
                          InputLabelProps={{
                            shrink: true
                          }}
                          onChange={this.handleChange}
                          name="bio"
                          value={this.state.bio}
                          helperText={
                            this.state.success.bioSuccess != null
                              ? this.state.success.bioSuccess
                              : this.state.errors.bioError
                              ? this.state.errors.bioError
                              : ""
                          }
                        />
                      }
                    ></ListItemText>

                    <ListItemSecondaryAction>
                      <Button
                        color="secondary"
                        variant="contained"
                        disabled={
                          this.state.bio === this.props.user.credentials.bio
                        }
                        onClick={() => this.handleSave("bio")}
                      >
                        Save
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                <br />
                <List
                  subheader={<ListSubheader>Account Settings</ListSubheader>}
                >
                  <ListItem>
                    <ListItemIcon>
                      <Mail />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <TextField
                          label="Email"
                          InputLabelProps={{
                            shrink: true
                          }}
                          onChange={this.handleChange}
                          name="email"
                          value={this.state.email}
                          helperText={
                            this.state.success.emailSuccess != null
                              ? this.state.success.emailSuccess
                              : this.state.errors.emailError
                              ? this.state.errors.emailError
                              : ""
                          }
                        />
                      }
                      secondary={
                        this.state.email ===
                        this.props.user.credentials.email ? (
                          ""
                        ) : (
                          <React.Fragment>
                            <br></br>
                            <TextField
                              label="Confirm with password:"
                              InputLabelProps={{
                                shrink: true
                              }}
                              onChange={this.handleChange}
                              name="password"
                              type="password"
                              value={this.state.password}
                              helperText={
                                this.state.errors.passwordError
                                  ? this.state.errors.passwordError
                                  : ""
                              }
                            />
                          </React.Fragment>
                        )
                      }
                    ></ListItemText>

                    <ListItemSecondaryAction>
                      <Button
                        color="secondary"
                        variant="contained"
                        disabled={
                          this.state.email ===
                            this.props.user.credentials.email ||
                          this.state.password === ""
                        }
                        onClick={this.handleEmailChange}
                      >
                        Save
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Lock />
                    </ListItemIcon>
                    <ListItemText
                      primary="Password"
                      secondary={
                        this.state.success.passwordSuccess != null
                          ? this.state.success.passwordSuccess
                          : this.state.errors.passwordError
                          ? this.state.errors.passwordError
                          : ""
                      }
                    ></ListItemText>

                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        onClick={this.handlePasswordReset}
                      >
                        Reset
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                <br />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

settings.propTypes = {
  getUserPersonalData: PropTypes.func.isRequired,
  setUserPersonalData: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  getUserPersonalData,
  setUserPersonalData,
  resetPassword
};

export default connect(mapStateToProps, mapActionsToProps)(settings);
