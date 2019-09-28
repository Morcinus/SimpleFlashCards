import React, { Component } from "react";
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
// Redux
import { connect } from "react-redux";

const styles = theme => ({
  tab: {
    backgroundColor: theme.palette.background.paper
  }
});

export class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      selectedTabIndex: 0
    };
  }

  handleChange = (event, newValue) => {
    this.setState({
      selectedTabIndex: newValue
    });
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
                  <Tabs
                    value={this.state.selectedTabIndex}
                    onChange={this.handleChange}
                  >
                    <Tab label="Home" component={Link} to="/" />
                    <Tab label="Signup" component={Link} to="/signup" />
                    <Tab label="Login" component={Link} to="/login" />
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
                  <Tabs
                    value={this.state.selectedTabIndex}
                    onChange={this.handleChange}
                  >
                    <Tab label="Home" component={Link} to="/" />
                    <Tab label="Create" component={Link} to="/" />
                    <Tab label="My Account" component={Link} to="/" />
                  </Tabs>
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
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Navbar));
