import React, { Component } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

// Other
import { renderDecks, renderCollections } from "../util/functions";

// Redux
import { connect } from "react-redux";
import { getUserDataByUsername, clearUserData } from "../redux/actions/userActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

/**
 * @class userProfile
 * @extends Component
 * @category Pages
 * @classdesc Na této stránce se zobrazuje profil daného uživatele.
 *
 * @requires userActions~getUserDataByUsername
 * @requires userActions~clearUserData
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 * @requires {@link module:store~reducers module:store~reducers.user}
 */
export class userProfile extends Component {
  constructor() {
    super();
    this.state = {};
  }

  /**
   * @function componentDidMount
   * @memberOf userProfile
   * @description Zkontroluje, zda se má zobrazit profil přihlášeného uživatele, nebo profil jiného uživatele. Pokud jde o jiného uživatele, stáhne jeho data.
   */
  componentDidMount() {
    // Zkontroluje, zda byla funkce getUserData() v Navbaru zavolána
    if (this.props.location.state)
      if (this.props.location.state.isCurrentUserProfile === true) {
        // Odstraní isCurrentUserProfile z location state
        const state = { ...this.props.location.state };
        delete state.isCurrentUserProfile;
        this.props.history.replace({ ...this.props.location, state });
      } else this.props.getUserDataByUsername(this.props.match.params.username);
    else this.props.getUserDataByUsername(this.props.match.params.username);
  }

  /**
   * @function componentWillUnmount
   * @memberOf userProfile
   * @description Vymaže status aplikace a informace o profilu daného uživatele z reduceru.
   */
  componentWillUnmount() {
    this.props.clearUserData();
    this.props.clearStatus();
  }

  render() {
    const {
      uiStatus: { status, errorCodes }
    } = this.props;
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid item sm={8} lg={8} xl={8}>
            <Paper>
              <div style={{ padding: "25px 50px" }}>
                {status == "BUSY" && (
                  <React.Fragment>
                    <LinearProgress color="secondary" />
                    <Typography variant="h5" color="secondary" align="right">
                      Loading...
                    </Typography>
                  </React.Fragment>
                )}
                {status == "ERROR" &&
                  (errorCodes.includes("userprofile/user-not-found") ? (
                    <Typography variant="h6" color="error" align="center">
                      Error 404: User not found!
                    </Typography>
                  ) : (
                    ""
                  ))}
                {status == "SUCCESS" && (
                  <React.Fragment>
                    <Typography variant="h5">{this.props.user.userProfile.username}</Typography>
                    <Typography variant="h6">{this.props.user.userProfile.bio}</Typography>
                    <Divider></Divider>

                    <br />

                    <Typography variant="h5">Decks created by this user</Typography>
                    {this.props.user.userProfile.createdDecks && (
                      <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                        {renderDecks(this.props.user.userProfile.createdDecks)}
                      </Grid>
                    )}
                    <br />
                    <Typography variant="h5">Collections created by this user</Typography>
                    {this.props.user.userProfile.createdCollections && (
                      <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                        {renderCollections(this.props.user.userProfile.createdCollections)}
                      </Grid>
                    )}
                  </React.Fragment>
                )}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

userProfile.propTypes = {
  getUserDataByUsername: PropTypes.func.isRequired,
  clearUserData: PropTypes.func.isRequired,
  clearStatus: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  uiStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  getUserDataByUsername,
  clearUserData,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(userProfile);
