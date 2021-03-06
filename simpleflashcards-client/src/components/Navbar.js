import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import FaceIcon from "@material-ui/icons/Face";
import HomeIcon from "@material-ui/icons/Home";
import QueueIcon from "@material-ui/icons/Queue";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

// Redux
import { connect } from "react-redux";
import { logoutUser, getUserData } from "../redux/actions/userActions";

/**
 * @function styles
 * @memberof Navbar
 * @description Určuje CSS pro daný komponent.
 * @param {Object} theme - Theme (CSS) celé aplikace.
 */
const styles = theme => ({
  tab: {
    backgroundColor: theme.palette.background.paper
  }
});

/**
 * @class Navbar
 * @extends Component
 * @category Components
 * @classdesc Tento komponent zobrazuje navigační lištu aplikace.
 * @param {Object} props - Vstupní data pro daný komponent.
 * @property {Object} state - Vnitřní state komponentu.
 * @property {number} state.selectedTabIndex - Index pro Tabs komponent.
 * @property {element} state.anchorEl - Obsahuje element, ke kterému se má přichytit vyskakovací menu při kliknutí na ikonu uživatele.
 * @property {boolean} state.myProfileClicked - Určuje, zda-li uživatel kliknul na jeho profil v navigační liště.
 *
 * @requires userActions~logoutUser
 * @requires userActions~getUserData
 * @requires {@link module:store~reducers module:store~reducers.user}
 */
export class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTabIndex: 0,
      anchorEl: null,
      myProfileClicked: false
    };
    this.handleMyProfileClick = this.handleMyProfileClick.bind(this);
  }

  /**
   * @function handleTabChange
   * @memberOf Navbar
   * @description Přepisuje [selectedTabIndex]{@link Navbar} v state tohoto komponentu při přepnutí v Tabs navigation baru.
   * @param {number} newValue - Nová hodnota pro [selectedTabIndex]{@link Navbar}.
   */
  handleTabChange = (_, newValue) => {
    this.setState({
      selectedTabIndex: newValue
    });
  };

  /**
   * @function handleClick
   * @memberOf Navbar
   * @description Při kliknutí na ikonu uživatele přiřadí do anchorEl v state tohoto komponentu daný element.
   * @param {event} event - Událost, která vyvolala spuštění této funkce.
   */
  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  /**
   * @function handleClose
   * @memberOf Navbar
   * @description Při zavření vyskakovacího menu nastaví anchorEl v state tohoto komponentu na null.
   */
  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  /**
   * @function handleMyProfileClick
   * @memberOf Navbar
   * @description Při kliknutí na tlačítko profilu uživatele získá data ze serveru o profilu daného uživatele. Také zavře vyskakovací menu.
   */
  handleMyProfileClick = () => {
    this.setState({
      myProfileClicked: true
    });
    this.props.getUserData();
    this.handleClose();
  };

  /**
   * @function componentDidUpdate
   * @memberOf Navbar
   * @description Po stažení dat o profilu uživatele přesměruje uživatele na jeho profil.
   * @param {Object} prevProps - Předchozí props daného komponentu.
   */
  componentDidUpdate(prevProps) {
    if (this.state.myProfileClicked) {
      if (this.props.user) {
        if (this.props.user.userProfile !== prevProps.user.userProfile) {
          this.setState({
            myProfileClicked: false
          });
          this.props.history.push({
            pathname: `/user/${this.props.user.userProfile.username}`,
            state: { isCurrentUserProfile: true }
          });
        }
      }
    }
  }

  /**
   * @function handleLogout
   * @memberOf Navbar
   * @description Při kliknutí na tlačítko k odhlášení odhlásí daného uživatele.
   */
  handleLogout = () => {
    this.handleClose();
    this.props.logoutUser();
  };

  render() {
    const {
      user: { authenticated }
    } = this.props;

    return !authenticated ? (
      <div>
        <AppBar position="fixed">
          <Grid container justify="center">
            <Grid item xs={12} sm={10} style={{ marginLeft: 10 }}>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box flexGrow={1}>
                  <Typography variant="h6">Simple Flashcards</Typography>
                </Box>
                <Box>
                  <Tabs value={this.state.selectedTabIndex} onChange={this.handleTabChange}>
                    <Tab
                      label={
                        <div>
                          <ExitToAppIcon
                            style={{
                              display: "inline-block",
                              marginBottom: "-5px",
                              marginRight: 5
                            }}
                          />
                          Login
                        </div>
                      }
                      component={Link}
                      to="/login"
                    />
                    <Tab
                      label={
                        <div>
                          <PersonAddIcon
                            style={{
                              display: "inline-block",
                              marginBottom: "-5px",
                              marginRight: 5
                            }}
                          />
                          Signup
                        </div>
                      }
                      component={Link}
                      to="/signup"
                    />
                  </Tabs>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </AppBar>
      </div>
    ) : (
      <div>
        <AppBar position="fixed">
          <Grid container justify="center">
            <Grid item xs={12} sm={10} style={{ marginLeft: 10 }}>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box flexGrow={1}>
                  <Typography variant="h6">Simple Flashcards</Typography>
                </Box>
                <Box>
                  <Tabs value={this.state.selectedTabIndex} onChange={this.handleTabChange}>
                    <Tab
                      label={
                        <div>
                          <HomeIcon
                            style={{
                              display: "inline-block",
                              marginBottom: "-5px",
                              marginRight: 5
                            }}
                          />
                          Home
                        </div>
                      }
                      component={Link}
                      to="/home"
                    />
                    <Tab
                      label={
                        <div>
                          <QueueIcon
                            style={{
                              display: "inline-block",
                              marginBottom: "-5px",
                              marginRight: 5
                            }}
                          />
                          Create
                        </div>
                      }
                      component={Link}
                      to="/createDeck"
                    />
                  </Tabs>
                </Box>
                <Box>
                  <IconButton onClick={this.handleClick} color="inherit">
                    <AccountCircleIcon />
                  </IconButton>

                  <Menu id="simple-menu" anchorEl={this.state.anchorEl} keepMounted open={Boolean(this.state.anchorEl)} onClose={this.handleClose}>
                    <MenuItem onClick={this.handleMyProfileClick}>
                      <FaceIcon style={{ marginRight: 5 }} />
                      My Profile
                    </MenuItem>
                    <MenuItem onClick={this.handleClose} component={Link} to="/settings">
                      <SettingsIcon style={{ marginRight: 5 }} />
                      Settings
                    </MenuItem>
                    <MenuItem onClick={this.handleLogout} component={Link} to="/login">
                      <ExitToAppIcon style={{ marginRight: 5 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </AppBar>
      </div>
    );
  }
}

Navbar.propTypes = {
  user: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  getUserData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  logoutUser,
  getUserData
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(withRouter(Navbar)));
