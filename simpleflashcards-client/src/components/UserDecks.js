import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

// Other
import { renderDecks } from "../util/functions";

// Redux
import { connect } from "react-redux";
import { getUserDecks, clearUserDecks } from "../redux/actions/deckUiActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

export class UserDecks extends Component {
  componentDidMount() {
    this.props.getUserDecks();
  }

  componentWillUnmount() {
    this.props.clearStatus();
    this.props.clearUserDecks();
  }

  render() {
    const {
      uiStatus: { status, errorCodes }
    } = this.props;
    return (
      <div>
        {status == "BUSY" && (
          <React.Fragment>
            <LinearProgress color="secondary" />
            <Typography variant="h5" color="secondary" align="right">
              Loading...
            </Typography>
          </React.Fragment>
        )}
        {status == "ERROR" && errorCodes.includes("deck/no-deck-found") && (
          <Typography variant="h6" color="error" align="center">
            You don't have any decks!
          </Typography>
        )}
        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
          {status == "SUCCESS" && renderDecks(this.props.deckUi.userDecks)}
        </Grid>
      </div>
    );
  }
}

UserDecks.propTypes = {
  getUserDecks: PropTypes.func.isRequired,
  clearUserDecks: PropTypes.func.isRequired,
  deckUi: PropTypes.object.isRequired,
  clearStatus: PropTypes.func.isRequired,
  uiStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  deckUi: state.deckUi,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  getUserDecks,
  clearUserDecks,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(UserDecks);
