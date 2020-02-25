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
import AccountCircle from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Settings from "@material-ui/icons/Settings";
import Face from "@material-ui/icons/Face";
import Home from "@material-ui/icons/Home";
import Queue from "@material-ui/icons/Queue";
import PersonAdd from "@material-ui/icons/PersonAdd";

// Redux
import { connect } from "react-redux";
import { logoutUser, getUserData } from "../redux/actions/userActions";

const styles = theme => ({
  tab: {
    backgroundColor: theme.palette.background.paper
  }
});

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

  handleChange = (event, newValue) => {
    this.setState({
      selectedTabIndex: newValue
    });
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  handleMyProfileClick = () => {
    this.setState({
      myProfileClicked: true
    });
    this.props.getUserData();
    this.handleClose();
  };

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
            <Grid item xs={10}>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box flexGrow={1}>
                  <Typography variant="h6">Simple Flashcards</Typography>
                </Box>
                <Box>
                  <Tabs value={this.state.selectedTabIndex} onChange={this.handleChange}>
                    <Tab
                      label={
                        <div>
                          <ExitToApp
                            item
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
                          <PersonAdd
                            item
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
            <Grid item xs={10}>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box flexGrow={1}>
                  <Typography variant="h6">Simple Flashcards</Typography>
                </Box>
                <Box>
                  <Tabs value={this.state.selectedTabIndex} onChange={this.handleChange}>
                    <Tab
                      label={
                        <div>
                          <Home
                            item
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
                          <Queue
                            item
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
                    <AccountCircle />
                  </IconButton>

                  <Menu id="simple-menu" anchorEl={this.state.anchorEl} keepMounted open={Boolean(this.state.anchorEl)} onClose={this.handleClose}>
                    <MenuItem onClick={this.handleMyProfileClick}>
                      <Face style={{ marginRight: 5 }} />
                      My Profile
                    </MenuItem>
                    <MenuItem onClick={this.handleClose} component={Link} to="/settings">
                      <Settings style={{ marginRight: 5 }} />
                      Settings
                    </MenuItem>
                    <MenuItem onClick={this.handleLogout} component={Link} to="/login">
                      <ExitToApp style={{ marginRight: 5 }} />
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
