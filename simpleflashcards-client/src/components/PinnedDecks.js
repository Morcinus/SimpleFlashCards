import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

// Other
import { renderDecks } from "../util/functions";

// Redux
import { connect } from "react-redux";
import { getPinnedDecks, clearPinnedDecks } from "../redux/actions/deckUiActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

export class PinnedDecks extends Component {
  componentDidMount() {
    this.props.getPinnedDecks();
  }

  componentWillUnmount() {
    this.props.clearStatus();
    this.props.clearPinnedDecks();
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
            You don't have any pinned decks!
          </Typography>
        )}
        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
          {status == "SUCCESS" && renderDecks(this.props.deckUi.pinnedDecks)}
        </Grid>
      </div>
    );
  }
}

PinnedDecks.propTypes = {
  getPinnedDecks: PropTypes.func.isRequired,
  clearPinnedDecks: PropTypes.func.isRequired,
  deckUi: PropTypes.object.isRequired,
  clearStatus: PropTypes.func.isRequired,
  uiStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  deckUi: state.deckUi,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  getPinnedDecks,
  clearPinnedDecks,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(PinnedDecks);
