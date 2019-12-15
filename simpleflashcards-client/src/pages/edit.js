import React, { Component } from "react";
import PropTypes from "prop-types";
import DeckTable from "../components/DeckTable";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {
  Divider,
  TextField,
  Box,
  Button
} from "@material-ui/core";
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
  saveDeckDraft,
  deleteDeck,
  deleteDeckDraft,
  uploadDeck,
  getDeck
} from "../redux/actions/editDeckActions";

export class edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      deckName: "",
      deckDescription: "",
      deckImage: null,
      deckCards: [],
      imageUrl: null,
      dialogOpen: false
    };
    this.updateDeckCards = this.updateDeckCards.bind(this);
    this.handleUploadButtonClick = this.handleUploadButtonClick.bind(this);
    this.deleteDeck = this.deleteDeck.bind(this);
    this.uploadDeck = this.uploadDeck.bind(this);
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
    this.props.getDeck(this.props.match.params.deckId);
  }

  componentDidUpdate(prevProps) {
    // Deck
    if (this.props.deckEdit) {
      if (this.props.deckEdit !== prevProps.deckEdit) {
        let deckCards = [];
        for (let i = 0; i < this.props.deckEdit.deckCards.length; i++) {
          let newCard = {
            frontPage: this.props.deckEdit.deckCards[i].body1,
            backPage: this.props.deckEdit.deckCards[i].body2,
            cardId: this.props.deckEdit.deckCards[i].cardId,
            index: i + 1
          };
          deckCards.push(newCard);
        }

        this.setState({
          deckName: this.props.deckEdit.deckName,
          deckDescription: this.props.deckEdit.deckDescription,
          deckCards: deckCards,
          imageUrl: this.props.deckEdit.imageUrl,
          deckImage: this.props.deckEdit.deckImage
        });
      }
    }
  }

  componentWillUnmount() {
    let deckData = {
      deckName: this.state.deckName,
      deckDescription: this.state.deckDescription,
      deckImage: this.state.deckImage,
      deckCards: this.state.deckCards,
      imageUrl: this.state.imageUrl
    };
    this.props.saveDeckDraft(deckData);
  }

  // Used to communicate with DeckTable
  updateDeckCards(cards) {
    this.setState({
      deckCards: cards
    });
  }

  deleteDeck() {
    this.setState({
      errors: {},
      deckName: "",
      deckDescription: "",
      deckImage: null,
      deckCards: [],
      imageUrl: null,
      dialogOpen: false
    });
    this.props.deleteDeck(this.props.match.params.deckId);
    this.handleDialogClose();
  }

  uploadDeck() {
    const imageFormData = new FormData();
    if (this.state.deckImage) {
      imageFormData.append(
        "deckImage",
        this.state.deckImage,
        this.state.deckImage.name
      );
    }

    let deckData = {
      deckName: this.state.deckName,
      deckDescription: this.state.deckDescription,
      deckCards: this.state.deckCards,
      imageFormData: imageFormData
    };

    const failed = this.props.uploadDeck(
      deckData,
      this.props.match.params.deckId
    );
    console.log(failed);
    if (!failed) {
      console.log("Failed false");
      console.log("Initial state:");
      this.setState({
        errors: {},
        deckName: "",
        deckDescription: "",
        deckImage: null,
        deckCards: [],
        imageUrl: null,
        dialogOpen: false,
        uploadSucceeded: true
      });
      this.props.deleteDeckDraft();
    } else {
      console.log("Failed true");
      this.setState({ uploadSucceeded: false });
    }
  }

  handleImageChange = event => {
    if (event.target.files[0]) {
      this.setState({
        deckImage: event.target.files[0],
        imageUrl: URL.createObjectURL(event.target.files[0])
      });
    }
  };

  handleUploadButtonClick() {
    document.getElementById("imageInput").click();
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
                <Typography variant="h4">Edit deck</Typography>
                <Divider></Divider>
                <br />
                <Grid container>
                  <Grid item sm={9} lg={9} xl={9} container direction="row">
                    <Grid>
                      {this.state.imageUrl ? (
                        <Button
                          style={{
                            width: "110px",
                            height: "130px",
                            marginRight: "20px",
                            backgroundImage: `url(${this.state.imageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                          }}
                          onClick={this.handleUploadButtonClick}
                        >
                          <input
                            type="file"
                            id="imageInput"
                            hidden="hidden"
                            onChange={this.handleImageChange}
                          />
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          style={{
                            width: "110px",
                            height: "130px",
                            marginRight: "20px"
                          }}
                          onClick={this.handleUploadButtonClick}
                        >
                          <input
                            type="file"
                            id="imageInput"
                            hidden="hidden"
                            onChange={this.handleImageChange}
                          />
                          <Typography
                            style={{ textAlign: "center" }}
                            variant="body2"
                          >
                            <Photo></Photo>
                            CHOOSE COVER (OPTIONAL)
                          </Typography>
                        </Button>
                      )}
                    </Grid>
                    <Grid>
                      <Box style={{ marginBottom: "20px" }}>
                        {this.state.errors.deckNameError ? (
                          <TextField
                            error
                            variant="outlined"
                            label="Enter Title"
                            name="deckName"
                            value={this.state.deckName}
                            onChange={this.handleChange}
                            helperText={this.state.errors.deckNameError}
                            InputLabelProps={{
                              shrink: true
                            }}
                          ></TextField>
                        ) : (
                          <TextField
                            variant="outlined"
                            label="Enter Title"
                            name="deckName"
                            value={this.state.deckName}
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
                          name="deckDescription"
                          value={this.state.deckDescription}
                          onChange={this.handleChange}
                          InputLabelProps={{
                            shrink: true
                          }}
                        ></TextField>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    sm={3}
                    lg={3}
                    xl={3}
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
                        onClick={this.uploadDeck}
                      >
                        Save
                      </Button>
                    </Grid>
                    <Grid>
                      {this.state.errors.deckCardsError ? (
                        <Typography align="right" color="error">
                          {this.state.errors.deckCardsError}
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
                <br />
                <DeckTable
                  data={this.state.deckCards}
                  updateDeckCards={this.updateDeckCards}
                ></DeckTable>
              </div>
            </Paper>
          </Grid>
        </Grid>
        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle>
            Delete Deck
          </DialogTitle>
          <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this deck forever?  <br />
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
              onClick={this.deleteDeck}
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

edit.propTypes = {
  saveDeckDraft: PropTypes.func.isRequired,
  deleteDeck: PropTypes.func.isRequired,
  deleteDeckDraft: PropTypes.func.isRequired,
  uploadDeck: PropTypes.func.isRequired,
  getDeck: PropTypes.func.isRequired,
  deckEdit: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  deckEdit: state.deckEdit,
  UI: state.UI
});

const mapActionsToProps = {
  saveDeckDraft,
  deleteDeck,
  deleteDeckDraft,
  uploadDeck,
  getDeck
};

export default connect(mapStateToProps, mapActionsToProps)(edit);
