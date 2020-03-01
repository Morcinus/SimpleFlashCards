import React, { Component } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import withStyles from "@material-ui/core/styles/withStyles";

// Other
import { renderDecks } from "../util/functions";

// Redux
import { connect } from "react-redux";
import { getPinnedDecks, clearPinnedDecks } from "../redux/actions/deckUiActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

/**
 * @function styles
 * @memberof PinnedDecks
 * @description Určuje CSS pro daný komponent.
 * @param {Object} theme - Theme (CSS) celé aplikace.
 */
const styles = theme => ({
  deckGrid: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center"
    },
    [theme.breakpoints.up("md")]: {
      justifyContent: "flex-start"
    }
  }
});

/**
 * @class PinnedDecks
 * @extends Component
 * @category Components
 * @classdesc Tento komponent zobrazuje balíčky, které byly připnuty uživatelem.
 *
 * @requires deckUiActions~getPinnedDecks
 * @requires deckUiActions~clearPinnedDecks
 * @requires functions~renderDecks
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 * @requires {@link module:store~reducers module:store~reducers.deckUi}
 */
export class PinnedDecks extends Component {
  /**
   * @function componentDidMount
   * @memberOf PinnedDecks
   * @description Stáhne seznam balíčků, které byly připnuty uživatelem.
   */
  componentDidMount() {
    this.props.getPinnedDecks();
  }

  /**
   * @function componentWillUnmount
   * @memberOf PinnedDecks
   * @description Vymaže status aplikace a připnuté balíčky z reduceru.
   */
  componentWillUnmount() {
    this.props.clearStatus();
    this.props.clearPinnedDecks();
  }

  render() {
    const {
      classes,
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
        <Grid className={classes.deckGrid} container direction="row" justify="flex-start" alignItems="flex-start">
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
  uiStatus: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
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

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(PinnedDecks));
