import React, { Component } from "react";
import PropTypes from "prop-types";

// Material UI
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import AddBox from "@material-ui/icons/AddBox";

// Other
import { collectionDefaultImgUrl } from "../util/other";

// Redux
import { connect } from "react-redux";
import {
  closeCollectionDialog,
  getUserCollectionsWithDeckInfo,
  clearUserCollections,
  addDeckToCollection
} from "../redux/actions/colUiActions";

export class CollectionDialog extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleAddToCollection = this.handleAddToCollection.bind(this);
  }

  componentDidMount() {
    this.props.getUserCollectionsWithDeckInfo(this.props.deckId);
  }

  componentWillUnmount() {
    this.props.clearUserCollections();
  }

  handleClose = () => {
    this.props.closeCollectionDialog();
  };

  handleAddToCollection(colId, i) {
    console.log(colId);
    let failed = this.props.addDeckToCollection(colId, this.props.deckId, i);
    if (!failed) {
      console.log("success");
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.colUi.collectionDialogOpen}
        onClose={this.handleClose}
      >
        <DialogContent>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Add to new collection</Typography>

            <IconButton onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>

          <div>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    variant="square"
                    src={collectionDefaultImgUrl}
                  ></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <TextField placeholder="Collection Name" margin="normal" />
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end">
                    <AddBox />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </div>
          <Typography variant="h6">Add to existing collection</Typography>
          <div>
            <List>
              {this.props.colUi.userCollections.map((collection, i) => {
                return (
                  <ListItem key={i}>
                    <ListItemAvatar>
                      <Avatar
                        src={collectionDefaultImgUrl}
                        variant="square"
                      ></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={collection.colName}
                      secondary={
                        collection.colDescription
                          ? collection.colDescription
                          : null
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        id={collection.colId}
                        onClick={() =>
                          this.handleAddToCollection(collection.colId, i)
                        }
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
  addDeckToCollection: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  colUi: state.colUi
});

const mapActionsToProps = {
  closeCollectionDialog,
  getUserCollectionsWithDeckInfo,
  clearUserCollections,
  addDeckToCollection
};

export default connect(mapStateToProps, mapActionsToProps)(CollectionDialog);
