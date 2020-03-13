import React, { Component } from "react";
import PropTypes from "prop-types";

// Material UI
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

// Redux
import { connect } from "react-redux";
import { closeErrorAlert } from "../redux/actions/uiStatusActions";

/**
 * @class GlobalErrorAlert
 * @extends Component
 * @category Components
 * @classdesc Tento komponent zobrazuje vyskakovací okno s univerzální errorovou hláškou, pokud v aplikaci nastane nečekaná chyba, která není zachycena jiným komponentem.
 *
 * @requires uiStatusActions~closeErrorAlert
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 */
export class GlobalErrorAlert extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  /**
   * @function handleClose
   * @memberOf GlobalErrorAlert
   * @description Zavře errorové okno.
   */
  handleClose = () => {
    this.props.closeErrorAlert();
  };

  render() {
    const {
      uiStatus: { globalErrorAlertOpen }
    } = this.props;
    return (
      <React.Fragment>
        {globalErrorAlertOpen && (
          <React.Fragment>
            <Snackbar open={globalErrorAlertOpen} autoHideDuration={10000} onClose={this.handleClose}>
              <Alert onClose={this.handleClose} severity="error">
                An unexpected error has occured. Please try again later.
              </Alert>
            </Snackbar>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

GlobalErrorAlert.propTypes = {
  closeErrorAlert: PropTypes.func.isRequired,
  uiStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  closeErrorAlert
};

export default connect(mapStateToProps, mapActionsToProps)(GlobalErrorAlert);
