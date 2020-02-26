import React, { Component } from "react";
import PropTypes from "prop-types";

// Material UI
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import AddBox from "@material-ui/icons/AddBox";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";

// Other
import { collectionDefaultImgUrl } from "../util/other";

// Redux
import { connect } from "react-redux";
import {
  closeCollectionDialog,
  getUserCollectionsWithDeckInfo,
  clearUserCollections,
  addDeckToCollection,
  createCollection
} from "../redux/actions/colUiActions";

const initialState = {
  newColName: "",
  private: false
};

/**
 * @class CollectionDialog
 * @extends Component
 * @category Components
 * @classdesc Tento komponent umožňuje uživateli vytvořit novou kolekci, nebo přidat balíček do již existující kolekce tohoto uživatele.
 * @property {Object} state - vnitřní state komponentu
 * @property {string} state.newColName - Text, který uživatel zadá do formuláře do políčka pro název vytvářené kolekce.
 * @property {boolean} state.private - Určuje, zda bude nově vytvořená kolekce soukromá nebo veřejná.
 *
 * @requires colUiActions~closeCollectionDialog
 * @requires colUiActions~getUserCollectionsWithDeckInfo
 * @requires colUiActions~clearUserCollections
 * @requires colUiActions~addDeckToCollection
 * @requires colUiActions~createCollection
 * @requires {@link module:store~reducers module:store~reducers.colUi}
 */
export class CollectionDialog extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleClose = this.handleClose.bind(this);
    this.handleAddToCollection = this.handleAddToCollection.bind(this);
    this.handleCreateCollection = this.handleCreateCollection.bind(this);
  }

  /**
   * @function componentDidMount
   * @memberOf CollectionDialog
   * @description Získá seznam kolekcí společně s informacemi, zda-li je balíček již v kolekcích obsažen.
   */
  componentDidMount() {
    this.props.getUserCollectionsWithDeckInfo(this.props.deckId);
  }

  /**
   * @function componentWillUnmount
   * @memberOf CollectionDialog
   * @description Vymaže seznam kolekcí z reduceru.
   */
  componentWillUnmount() {
    this.props.clearUserCollections();
  }

  /**
   * @function handleClose
   * @memberOf CollectionDialog
   * @description Zavře toto dialogové okno.
   */
  handleClose = () => {
    this.props.closeCollectionDialog();
  };

  /**
   * @function handleAddToCollection
   * @memberOf CollectionDialog
   * @description Pošle na server požadavek, aby byl daný balíček přidán do kolekce.
   * @param {string} colId - ID kolekce, do které má být přidán balíček.
   * @param {number} i - Index kolekce v poli kolekcí.
   */
  handleAddToCollection(colId, i) {
    this.props.addDeckToCollection(colId, this.props.deckId, i);
  }

  /**
   * @function handleCreateCollection
   * @memberOf CollectionDialog
   * @description Pošle na server požadavek, aby byla vytvořena nová kolekce s daným názvem, která bude soukromá nebo veřejná a bude obsahovat daný balíček.
   */
  handleCreateCollection() {
    this.props.createCollection(this.state.newColName, this.props.deckId, this.state.private);
    this.setState(initialState);
  }

  /**
   * @function handleChange
   * @memberOf CollectionDialog
   * @description Přepisuje data v state tohoto komponentu na základě změn v textových polích formuláře.
   * @param {event} event - Event, který vyvolal spuštění této funkce.
   */
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  /**
   * @function handleSwitchChange
   * @memberOf CollectionDialog
   * @description Přepisuje data v state tohoto komponentu na základě přepínání switche pro nastavení přístupnosti kolekce.
   * @param {event} event - Event, který vyvolal spuštění této funkce.
   */
  handleSwitchChange = event => {
    this.setState({
      [event.target.name]: event.target.checked
    });
  };

  render() {
    const {
      colUi: { colDialogStatus, colDialogErrorCodes, colDialogSuccessCodes }
    } = this.props;
    return (
      <Dialog open={this.props.colUi.collectionDialogOpen} onClose={this.handleClose}>
        <DialogContent>
          {colDialogStatus == "BUSY" && (
            <React.Fragment>
              <LinearProgress color="secondary" />
              <Typography variant="h5" color="secondary" align="right">
                Loading...
              </Typography>
            </React.Fragment>
          )}

          {this.props.colUi && this.props.colUi.userCollections.length > 0 && (
            <React.Fragment>
              <Grid container direction="row" justify="space-between" alignItems="center">
                <Typography variant="h6">Add to new collection</Typography>

                <IconButton onClick={this.handleClose}>
                  <CloseIcon />
                </IconButton>
              </Grid>

              <div>
                <List style={{ paddingBottom: 0 }}>
                  <ListItem style={{ paddingBottom: 0 }}>
                    <ListItemAvatar>
                      <Avatar variant="square" src={collectionDefaultImgUrl}></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <TextField name="newColName" value={this.state.newColName} onChange={this.handleChange} placeholder="Collection Name" margin="normal" />
                      }
                    />
                    <ListItemSecondaryAction>
                      {colDialogSuccessCodes.includes("createCollection/collection-created") ? (
                        <IconButton edge="end">
                          <DoneIcon />
                        </IconButton>
                      ) : (
                        <IconButton edge="end" onClick={this.handleCreateCollection}>
                          <AddBox />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                {colDialogStatus == "ERROR" &&
                  (colDialogErrorCodes.includes("createCollection/invalid-collection-name") ? (
                    <Typography color="error" align="center">
                      Invalid collection name!
                    </Typography>
                  ) : (
                    colDialogErrorCodes.includes("createCollection/empty-collection-name") && (
                      <Typography color="error" align="center">
                        Collection name must not be empty!
                      </Typography>
                    )
                  ))}
                <Box display="flex" flexDirection="row-reverse" style={{ paddingRight: "1em" }}>
                  <FormControlLabel
                    labelPlacement="start"
                    control={<Switch checked={this.state.private} onChange={this.handleSwitchChange} value="checked" name="private" color="secondary" />}
                    label="Make Private"
                  />
                </Box>
              </div>
              <Typography variant="h6">Add to existing collection</Typography>
              <div>
                <List>
                  {this.props.colUi.userCollections.map((collection, i) => {
                    return (
                      <ListItem key={i}>
                        <ListItemAvatar>
                          <Avatar src={collectionDefaultImgUrl} variant="square"></Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={collection.colName} secondary={collection.colDescription ? collection.colDescription : null} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            id={collection.colId}
                            onClick={() => this.handleAddToCollection(collection.colId, i)}
                            disabled={collection.containsDeck}
                          >
                            <AddBox />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            </React.Fragment>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

CollectionDialog.propTypes = {
  colUi: PropTypes.object.isRequired,
  closeCollectionDialog: PropTypes.func.isRequired,
  getUserCollectionsWithDeckInfo: PropTypes.func.isRequired,
  clearUserCollections: PropTypes.func.isRequired,
  addDeckToCollection: PropTypes.func.isRequired,
  createCollection: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  colUi: state.colUi
});

const mapActionsToProps = {
  closeCollectionDialog,
  getUserCollectionsWithDeckInfo,
  clearUserCollections,
  addDeckToCollection,
  createCollection
};

export default connect(mapStateToProps, mapActionsToProps)(CollectionDialog);
