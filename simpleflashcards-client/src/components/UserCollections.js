import React, { Component } from "react";
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
import { getUserCollections, clearUserCollections } from "../redux/actions/colUiActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

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
 * @class UserCollections
 * @extends Component
 * @category Components
 * @classdesc Tento komponent zobrazí kolekce vytvořené daným uživatelem.
 *
 * @requires colUiActions~getUserCollections
 * @requires colUiActions~clearUserCollections
 * @requires functions~renderCollections
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 * @requires {@link module:store~reducers module:store~reducers.colUi}
 */
export class UserCollections extends Component {
  /**
   * @function componentDidMount
   * @memberOf UserCollections
   * @description Stáhne seznam kolekcí, které byly vytvořeny uživatelem.
   */
  componentDidMount() {
    this.props.getUserCollections();
  }

  componentWillUnmount() {
    this.props.clearStatus();
    this.props.clearUserCollections();
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
            You don't have any collections!
          </Typography>
        )}
        <Grid className={classes.deckGrid} container direction="row" justify="flex-start" alignItems="flex-start">
          {status == "SUCCESS" && renderCollections(this.props.colUi.userCollections)}
        </Grid>
      </div>
    );
  }
}

UserCollections.propTypes = {
  getUserCollections: PropTypes.func.isRequired,
  clearUserCollections: PropTypes.func.isRequired,
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
  getUserCollections,
  clearUserCollections,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(UserCollections));
