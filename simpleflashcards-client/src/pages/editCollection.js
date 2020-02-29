import React, { Component } from "react";
import PropTypes from "prop-types";
import ColTable from "../components/ColTable";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Divider, TextField, Box, Button } from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import FormControl from "@material-ui/core/FormControl";
import LinearProgress from "@material-ui/core/LinearProgress";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormLabel from "@material-ui/core/FormLabel";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import { deleteCollection, deleteCollectionDraft, updateCollection, getCollection } from "../redux/actions/editColActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

const styles = theme => ({
  tableBox: {
    // [theme.breakpoints.down("sm")]: {
    //   padding: "25px 10px"
    // },
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "center"
    }
  },
  container: {
    [theme.breakpoints.down("sm")]: {
      padding: "25px 10px"
    },
    [theme.breakpoints.up("md")]: {
      padding: "25px 50px"
    }
  },
  grid: {
    [theme.breakpoints.up("xs")]: {
      flexDirection: "column-reverse",
      alignItems: "flex-start"
    },
    [theme.breakpoints.up("md")]: {
      flexDirection: "column",
      alignItems: "flex-end"
    }
  },
  box: {
    [theme.breakpoints.down("sm")]: { flexDirection: "row-reverse", display: "flex", marginTop: "10px" }
  }
});

const initialState = {
  colName: "",
  colDescription: "",
  deckArray: [],
  dialogOpen: false,
  private: false
};

/**
 * @class editCollection
 * @extends Component
 * @category Pages
 * @classdesc Na této stránce může uživatel upravovat kolekci a následně nahrát novou verzi kolekce na server.
 * @property {Object} state - Vnitřní state komponentu
 * @property {string} state.colName - Uchovává název kolekce.
 * @property {string} state.colDescription - Uchovává popis kolekce.
 * @property {Array<Object>} state.deckArray - Uchovává balíčky obsažené v kolekci.
 * @property {boolean} state.private - Uchovává informaci, zda je kolekce veřejná či soukromá.
 *
 * @requires editColActions~deleteCollection
 * @requires editColActions~deleteCollectionDraft
 * @requires editColActions~updateCollection
 * @requires editColActions~getCollection
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 * @requires {@link module:store~reducers module:store~reducers.colEdit}
 */
export class editCollection extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.updateDeckArray = this.updateDeckArray.bind(this);
    this.deleteCollection = this.deleteCollection.bind(this);
    this.uploadCollection = this.uploadCollection.bind(this);
  }

  /**
   * @function handleChange
   * @memberOf editCollection
   * @description Přepisuje data v state tohoto komponentu na základě uživatelských změn při upravování kolekce.
   * @param {event} event - Event, který vyvolal spuštění této funkce.
   */
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  /**
   * @function componentDidMount
   * @memberOf editCollection
   * @description Stáhne data kolekce ze serveru.
   */
  componentDidMount() {
    this.props.getCollection(this.props.match.params.colId);
  }

  /**
   * @function componentDidUpdate
   * @memberOf editCollection
   * @description Po stažení dat kolekce ze serveru je uloží do state tohoto komponentu.
   * @param {Object} prevProps - předchozí props daného komponentu
   */
  componentDidUpdate(prevProps) {
    // Load collection data after getCollection()
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
          deckArray: deckArray,
          private: this.props.colEdit.private
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.clearStatus();
  }

  /**
   * @function updateDeckArray
   * @memberOf editCollection
   * @description Přepisuje seznam balíčků v kolekci na základě změn v tabulce balíčků.
   * @param {Array<Object>} decks - seznam balíčků v dané kolekci
   */
  updateDeckArray(decks) {
    this.setState({
      deckArray: decks
    });
  }

  /**
   * @function deleteCollection
   * @memberOf editCollection
   * @description Pošle na server požadavek o smazání kolekce a vymaže state komponentu.
   */
  deleteCollection() {
    this.setState(initialState);
    this.props.deleteCollection(this.props.match.params.colId);
    this.handleDialogClose();
  }

  /**
   * @function uploadCollection
   * @memberOf editCollection
   * @description Nahraje novou verzi kolekce na server.
   */
  uploadCollection() {
    let colData = {
      colName: this.state.colName,
      colDescription: this.state.colDescription,
      deckArray: this.state.deckArray,
      private: this.state.private
    };

    this.props.updateCollection(colData, this.props.match.params.colId);
  }

  /**
   * @function handleDialogOpen
   * @memberOf editCollection
   * @description Otevře dialogové okno tím, že nastaví ve state komponentu dialogOpen na true.
   */
  handleDialogOpen = () => {
    this.setState({
      dialogOpen: true
    });
  };

  /**
   * @function handleDialogClose
   * @memberOf editCollection
   * @description Zavře dialogové okno tím, že nastaví ve state komponentu dialogOpen na false.
   */
  handleDialogClose = () => {
    this.setState({
      dialogOpen: false
    });
  };

  render() {
    const {
      classes,
      uiStatus: { status, errorCodes, successCodes }
    } = this.props;
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid item xs={12} sm={10} md={10} lg={8} xl={6}>
            <Paper>
              <div className={classes.container}>
                {status == "BUSY" && (
                  <React.Fragment>
                    <LinearProgress color="secondary" />
                    <Typography variant="h5" color="secondary" align="right">
                      Loading...
                    </Typography>
                  </React.Fragment>
                )}
                {successCodes.includes("updateCollection/collection-deleted") ? (
                  <Typography variant="h5" color="secondary" align="center">
                    Collection was deleted!
                  </Typography>
                ) : errorCodes.includes("collection/collection-not-found") ? (
                  <Typography variant="h5" color="error" align="center">
                    Error 404: Collection not found!
                  </Typography>
                ) : (
                  <React.Fragment>
                    <Typography variant="h4">Edit collection</Typography>
                    <Divider></Divider>
                    <br />
                    <Grid container justify="center">
                      <Grid item container direction="row" justify="space-around" alignItems="flex-start">
                        <Grid item sm={12} md={9} lg={9} xl={9} container direction="column">
                          <Box style={{ marginBottom: "20px" }}>
                            <TextField
                              variant="outlined"
                              label="Enter Title"
                              name="colName"
                              value={this.state.colName}
                              onChange={this.handleChange}
                              helperText={
                                errorCodes.includes("updateCollection/empty-collection-name")
                                  ? "Collection name must not be empty!"
                                  : errorCodes.includes("updateCollection/invalid-collection-name")
                                  ? "Invalid collection name!"
                                  : ""
                              }
                              error={
                                errorCodes.includes("updateCollection/empty-collection-name")
                                  ? true
                                  : errorCodes.includes("updateCollection/invalid-collection-name")
                                  ? true
                                  : false
                              }
                              InputLabelProps={{
                                shrink: true
                              }}
                            ></TextField>
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

                        <Grid item sm={12} md={3} lg={3} xl={3} container>
                          <Grid className={classes.grid} item container>
                            <Box className={classes.box}>
                              <IconButton color="primary" variant="contained" onClick={this.handleDialogOpen}>
                                <Delete></Delete>
                              </IconButton>
                              <Button size="large" color="secondary" variant="contained" onClick={this.uploadCollection}>
                                Save
                              </Button>
                            </Box>

                            <FormControl variant="outlined" fullWidth>
                              <FormLabel>Collection visibility</FormLabel>
                              <Select name="private" value={this.state.private} onChange={this.handleChange}>
                                <MenuItem value={false}>Public</MenuItem>
                                <MenuItem value={true}>Private</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid>
                            {errorCodes.includes("updateCollection/empty-collection") ? (
                              <Typography align="right" color="error">
                                There must be at least 1 deck!
                              </Typography>
                            ) : (
                              successCodes.includes("updateCollection/collection-updated") && (
                                <Typography variant="h6" align="right" color="secondary">
                                  Upload was successful!
                                </Typography>
                              )
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <br />

                    <ColTable data={this.state.deckArray} updateDeckArray={this.updateDeckArray}></ColTable>
                  </React.Fragment>
                )}
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
            <Button onClick={this.handleDialogClose} color="primary" variant="outlined" autoFocus>
              Cancel
            </Button>
            <Button onClick={this.deleteCollection} color="primary" variant="contained">
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
  updateCollection: PropTypes.func.isRequired,
  getCollection: PropTypes.func.isRequired,
  colEdit: PropTypes.object.isRequired,
  uiStatus: PropTypes.object.isRequired,
  clearStatus: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  colEdit: state.colEdit,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  deleteCollection,
  deleteCollectionDraft,
  updateCollection,
  getCollection,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(editCollection));
