import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import withStyles from "@material-ui/core/styles/withStyles";

// Other
import { renderCollections } from "../util/functions";

// Redux
import { connect } from "react-redux";
import { getPinnedCollections, clearPinnedCollections } from "../redux/actions/colUiActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

/**
 * @function styles
 * @memberof PinnedCollections
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
 * @class PinnedCollections
 * @extends Component
 * @category Components
 * @classdesc Tento komponent zobrazuje kolekce, které byly připnuty uživatelem.
 *
 * @requires colUiActions~getPinnedCollections
 * @requires colUiActions~clearPinnedCollections
 * @requires functions~renderCollections
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 * @requires {@link module:store~reducers module:store~reducers.colUi}
 */
export class PinnedCollections extends Component {
  /**
   * @function componentDidMount
   * @memberOf PinnedCollections
   * @description Stáhne seznam kolekcí, které byly připnuty uživatelem.
   */
  componentDidMount() {
    this.props.getPinnedCollections();
  }

  /**
   * @function componentWillUnmount
   * @memberOf PinnedCollections
   * @description Vymaže status aplikace a připnuté kolekce z reduceru.
   */
  componentWillUnmount() {
    this.props.clearStatus();
    this.props.clearPinnedCollections();
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
        {status == "ERROR" && errorCodes.includes("collection/no-collection-found") && (
          <Typography variant="h6" color="error" align="center">
            You don't have any pinned collections!
          </Typography>
        )}
        <Grid className={classes.deckGrid} container direction="row" justify="flex-start" alignItems="flex-start">
          {status == "SUCCESS" && renderCollections(this.props.colUi.pinnedCollections)}
        </Grid>
      </div>
    );
  }
}

PinnedCollections.propTypes = {
  getPinnedCollections: PropTypes.func.isRequired,
  clearPinnedCollections: PropTypes.func.isRequired,
  colUi: PropTypes.object.isRequired,
  clearStatus: PropTypes.func.isRequired,
  uiStatus: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  colUi: state.colUi,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  getPinnedCollections,
  clearPinnedCollections,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(PinnedCollections));
