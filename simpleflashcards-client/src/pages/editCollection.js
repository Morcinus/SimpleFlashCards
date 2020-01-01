import React, { Component } from "react";
import PropTypes from "prop-types";
import ColTable from "../components/ColTable";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Divider, TextField, Box, Button } from "@material-ui/core";
import Photo from "@material-ui/icons/Photo";
import Delete from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

// Redux
import { connect } from "react-redux";
import {
  deleteCollection,
  deleteCollectionDraft,
  uploadCollection,
  getCollection
} from "../redux/actions/editColActions";

export class editCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      colName: "",
      colDescription: "",
      deckArray: [],
      dialogOpen: false
    };
    this.updateDeckArray = this.updateDeckArray.bind(this);
    this.deleteCollection = this.deleteCollection.bind(this);
    this.uploadCollection = this.uploadCollection.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  componentDidMount() {
    this.props.getCollection(this.props.match.params.colId);
  }

  componentDidUpdate(prevProps) {
    // Deck
    if (this.props.colEdit) {
      if (this.props.colEdit !== prevProps.colEdit) {
        let deckArray = [];
        for (let i = 0; i < this.props.colEdit.deckArray.length; i++) {
          let newDeck = {
            deckImage: this.props.colEdit.deckArray[i].deckImage,
            frontPage: this.props.colEdit.deckArray[i].deckName,
            deckId: this.props.colEdit.deckArray[i].deckId,
            index: i + 1
          };
          deckArray.push(newDeck);
        }
        this.setState({
          colName: this.props.colEdit.colName,
          colDescription: this.props.colEdit.colDescription,
          deckArray: deckArray
        });
      }
    }
  }

  // Used to communicate with ColTable
  updateDeckArray(decks) {
    this.setState({
      deckArray: decks
    });
  }

  deleteCollection() {
    this.setState({
      errors: {},
      colName: "",
      colDescription: "",
      deckArray: [],
      dialogOpen: false
    });
    this.props.deleteCollection(this.props.match.params.colId);
    this.handleDialogClose();
  }

  uploadCollection() {
    let colData = {
      colName: this.state.colName,
      colDescription: this.state.colDescription,
      deckArray: this.state.deckArray
    };

    const failed = this.props.uploadCollection(
      colData,
      this.props.match.params.colId
    );
    console.log(failed);
    // Tohle nebude fungovat, musim to kontrolovat na updatu
    if (!failed) {
      console.log("Failed false");
      console.log("Initial state:");
      this.setState({
        errors: {},
        colName: "",
        colDescription: "",
        deckArray: [],
        dialogOpen: false,
        uploadSucceeded: true
      });
      this.props.deleteCollectionDraft();
    } else {
      console.log("Failed true");
      this.setState({ uploadSucceeded: false });
    }
  }

  handleDialogOpen = () => {
    this.setState({
      dialogOpen: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false
    });
  };

  render() {
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid item sm={10} lg={10} xl={10}>
            <Paper>
              <div style={{ padding: "25px 50px" }}>
                <Typography variant="h4">Edit collection</Typography>
                <Divider></Divider>
                <br />
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="flex-start"
                >
                  <Grid item sm={2} lg={2} xl={2}></Grid>
                  <Grid
                    item
                    sm={8}
                    lg={8}
                    xl={8}
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                  >
                    <Grid item>
                      <Grid>
                        <Box style={{ marginBottom: "20px" }}>
                          {this.state.errors.colNameError ? (
                            <TextField
                              error
                              variant="outlined"
                              label="Enter Title"
                              name="colName"
                              value={this.state.colName}
                              onChange={this.handleChange}
                              helperText={this.state.errors.colNameError}
                              InputLabelProps={{
                                shrink: true
                              }}
                            ></TextField>
                          ) : (
                            <TextField
                              variant="outlined"
                              label="Enter Title"
                              name="colName"
                              value={this.state.colName}
                              onChange={this.handleChange}
                              InputLabelProps={{
                                shrink: true
                              }}
                            ></TextField>
                          )}
                        </Box>
                        <Box>
                          <TextField
                            variant="outlined"
                            label="Enter Description (optional)"
                            name="colDescription"
                            value={this.state.colDescription}
                            onChange={this.handleChange}
                            InputLabelProps={{
                              shrink: true
                            }}
                          ></TextField>
                        </Box>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid item>
                      <ColTable
                        data={this.state.deckArray}
                        updateDeckArray={this.updateDeckArray}
                      ></ColTable>
                    </Grid>
                  </Grid>
                  <Grid item sm={2} lg={2} xl={2}>
                    <Grid
                      item
                      container
                      direction="column"
                      justify="flex-start"
                      alignItems="flex-end"
                    >
                      <Grid
                        item
                        container
                        justify="flex-end"
                        alignItems="flex-start"
                      >
                        <IconButton
                          color="primary"
                          variant="contained"
                          onClick={this.handleDialogOpen}
                        >
                          <Delete></Delete>
                        </IconButton>
                        <Button
                          size="large"
                          color="secondary"
                          variant="contained"
                          onClick={this.uploadCollection}
                        >
                          Save
                        </Button>
                      </Grid>
                      <Grid>
                        {this.state.errors.deckArrayError ? (
                          <Typography align="right" color="error">
                            {this.state.errors.deckArrayError}
                          </Typography>
                        ) : this.state.uploadSucceeded === true ? ( // NEEDS UPDATE!!! to disappear after few secs + Add delete deck success
                          <Typography align="right">
                            Upload was successful
                          </Typography>
                        ) : (
                          <div></div>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Paper>
          </Grid>
        </Grid>
        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle>Delete Collection</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this collection forever? <br />
              You can't undo this action.
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              onClick={this.handleDialogClose}
              color="primary"
              variant="outlined"
              autoFocus
            >
              Cancel
            </Button>
            <Button
              onClick={this.deleteCollection}
              color="primary"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

editCollection.propTypes = {
  deleteCollection: PropTypes.func.isRequired,
  deleteCollectionDraft: PropTypes.func.isRequired,
  uploadCollection: PropTypes.func.isRequired,
  getCollection: PropTypes.func.isRequired,
  colEdit: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  colEdit: state.colEdit,
  UI: state.UI
});

const mapActionsToProps = {
  deleteCollection,
  deleteCollectionDraft,
  uploadCollection,
  getCollection
};

export default connect(mapStateToProps, mapActionsToProps)(editCollection);
