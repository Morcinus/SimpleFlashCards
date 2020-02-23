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
import LinearProgress from "@material-ui/core/LinearProgress";

// Redux
import { connect } from "react-redux";
import { getUserPersonalData, setUserPersonalData, resetPassword } from "../redux/actions/userActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

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
  }

  componentWillUnmount() {
    this.props.clearStatus();
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
    const {
      uiStatus: { status, errorCodes, successCodes }
    } = this.props;
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid item sm={6} lg={6} xl={6}>
            <Paper>
              <div style={{ padding: "25px 50px" }}>
                <Typography variant="h5">Settings</Typography>
                <Divider></Divider>

                <br />
                {status == "BUSY" && <LinearProgress color="secondary" />}
                <List subheader={<ListSubheader>Profile Settings</ListSubheader>}>
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
                            errorCodes.includes("settings/username-already-exists")
                              ? "This username is already taken!"
                              : successCodes.includes("settings/username-updated")
                              ? "Username updated successfully!"
                              : ""
                          }
                          error={errorCodes.includes("settings/username-already-exists") ? true : false}
                        />
                      }
                    ></ListItemText>

                    <ListItemSecondaryAction>
                      <Button
                        color="secondary"
                        variant="contained"
                        disabled={this.state.username === this.props.user.credentials.username}
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
                          helperText={successCodes.includes("settings/bio-updated") ? "Description updated successfully!" : ""}
                        />
                      }
                    ></ListItemText>

                    <ListItemSecondaryAction>
                      <Button
                        color="secondary"
                        variant="contained"
                        disabled={this.state.bio === this.props.user.credentials.bio}
                        onClick={() => this.handleSave("bio")}
                      >
                        Save
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                <br />
                <List subheader={<ListSubheader>Account Settings</ListSubheader>}>
                  <ListItem>
                    <ListItemIcon>
                      <Mail />
                    </ListItemIcon>
                    <Grid container direction="column" justify="flex-start" alignItems="flex-start">
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
                              errorCodes.includes("auth/invalid-email")
                                ? "Invalid email!"
                                : successCodes.includes("settings/email-updated")
                                ? "Email updated successfully!"
                                : ""
                            }
                            error={errorCodes.includes("auth/invalid-email") ? true : false}
                          />
                        }
                      ></ListItemText>
                      <ListItemText
                        primary={
                          this.state.email === this.props.user.credentials.email ? (
                            ""
                          ) : (
                            <TextField
                              label="Confirm with password:"
                              InputLabelProps={{
                                shrink: true
                              }}
                              onChange={this.handleChange}
                              name="password"
                              type="password"
                              value={this.state.password}
                              helperText={errorCodes.includes("auth/wrong-password") ? "Wrong password!" : ""}
                              error={errorCodes.includes("auth/wrong-password") ? true : false}
                            />
                          )
                        }
                      ></ListItemText>
                    </Grid>

                    <ListItemSecondaryAction>
                      <Button
                        color="secondary"
                        variant="contained"
                        disabled={this.state.email === this.props.user.credentials.email || this.state.password === ""}
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
                      secondary={successCodes.includes("settings/password-reset-email-sent") ? "The password reset link has been sent to your email!" : ""}
                    ></ListItemText>

                    <ListItemSecondaryAction>
                      <Button variant="outlined" onClick={this.handlePasswordReset}>
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
  clearStatus: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  uiStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  getUserPersonalData,
  setUserPersonalData,
  resetPassword,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(settings);
