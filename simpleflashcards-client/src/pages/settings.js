import React, { Component } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import LockIcon from "@material-ui/icons/Lock";
import PersonIcon from "@material-ui/icons/Person";
import MailIcon from "@material-ui/icons/Mail";
import NotesIcon from "@material-ui/icons/Notes";
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

/**
 * @class settings
 * @extends Component
 * @category Pages
 * @classdesc Na této stránce může uživatel měnit své údaje: uživatelské jméno, popisek profilu, email a heslo.
 * @property {Object} state - Vnitřní state komponentu.
 * @property {string} state.username - Text, který uchovává uživatelské jméno.
 * @property {string} state.bio - Text, který uchovává popis uživatelského profilu.
 * @property {string} state.email - Text, který uchovává email uživatele.
 * @property {string} state.password - Text, který uchovává heslo uživatele.
 *
 * @requires userActions~getUserPersonalData
 * @requires userActions~setUserPersonalData
 * @requires userActions~resetPassword
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 * @requires {@link module:store~reducers module:store~reducers.user}
 */
export class settings extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      bio: "",
      email: "",
      password: ""
    };
    this.handlePasswordReset = this.handlePasswordReset.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  /**
   * @function componentDidMount
   * @memberOf settings
   * @description Získá ze serveru osobní údaje uživatele.
   */
  componentDidMount() {
    this.props.getUserPersonalData();
  }

  /**
   * @function componentDidUpdate
   * @memberOf settings
   * @description Po stažení osobních údajů uživatele ze serveru je uloží do state tohoto komponentu.
   * @param {Object} prevProps - Předchozí props daného komponentu.
   */
  componentDidUpdate(prevProps) {
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

  /**
   * @function componentWillUnmount
   * @memberOf settings
   * @description Vymaže status aplikace v reduceru.
   */
  componentWillUnmount() {
    this.props.clearStatus();
  }

  /**
   * @function handleChange
   * @memberOf settings
   * @description Přepisuje data v state tohoto komponentu na základě uživatelských změn při upravování balíčku.
   * @param {event} event - Event, který vyvolal spuštění této funkce.
   */
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  /**
   * @function handleSave
   * @memberOf settings
   * @description Nahraje změněná osobní data uživatele na server.
   * @param {string} variableName - Název proměnné, která má být nahrána na server.
   */
  handleSave(variableName) {
    let userData = {
      [variableName]: this.state[variableName]
    };

    this.props.setUserPersonalData(userData);
  }

  /**
   * @function handlePasswordReset
   * @memberOf settings
   * @description Pošle na server požadavek o změnu hesla.
   */
  handlePasswordReset() {
    this.props.resetPassword();
  }

  /**
   * @function handleEmailChange
   * @memberOf settings
   * @description Pošle na server požadavek o změnu emailu.
   */
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
          <Grid item xs={12} sm={9} md={6} lg={5} xl={4}>
            <Paper>
              <div style={{ padding: "25px 50px" }}>
                <Typography variant="h5">Settings</Typography>
                <Divider></Divider>

                <br />
                {status == "BUSY" && <LinearProgress color="secondary" />}
                <List subheader={<ListSubheader>Profile Settings</ListSubheader>}>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
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
                              : errorCodes.includes("auth/invalid-username")
                              ? "Must be a valid username!"
                              : successCodes.includes("settings/username-updated")
                              ? "Username updated successfully!"
                              : ""
                          }
                          error={errorCodes.includes("settings/username-already-exists") ? true : errorCodes.includes("auth/invalid-username") ? true : false}
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
                      <NotesIcon />
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
                            errorCodes.includes("settings/too-long-bio")
                              ? "Description must not be longer than 250 characters!"
                              : successCodes.includes("settings/bio-updated")
                              ? "Description updated successfully!"
                              : ""
                          }
                          error={errorCodes.includes("settings/too-long-bio") ? true : false}
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
                      <MailIcon />
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
                      <LockIcon />
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
