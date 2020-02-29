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
import { getUserDecks, clearUserDecks } from "../redux/actions/deckUiActions";
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
 * @class UserDecks
 * @extends Component
 * @category Components
 * @classdesc Tento komponent zobrazí balíčky vytvořené daným uživatelem.
 *
 * @requires deckUiActions~getUserDecks
 * @requires deckUiActions~clearUserDecks
 * @requires functions~renderDecks
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 * @requires {@link module:store~reducers module:store~reducers.deckUi}
 */
export class UserDecks extends Component {
  /**
   * @function componentDidMount
   * @memberOf UserDecks
   * @description Stáhne seznam balíčků, které byly vytvořeny uživatelem.
   */
  componentDidMount() {
    this.props.getUserDecks();
  }

  componentWillUnmount() {
    this.props.clearStatus();
    this.props.clearUserDecks();
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
            You don't have any decks!
          </Typography>
        )}
        <Grid className={classes.deckGrid} container direction="row" alignItems="flex-start">
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
  uiStatus: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
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

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(UserDecks));
