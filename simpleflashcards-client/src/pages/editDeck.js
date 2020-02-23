import React, { Component } from "react";
import PropTypes from "prop-types";
import DeckTable from "../components/DeckTable";

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
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormLabel from "@material-ui/core/FormLabel";
import LinearProgress from "@material-ui/core/LinearProgress";

// Redux
import { connect } from "react-redux";
import { deleteDeck, deleteDeckDraft, updateDeck, getDeck } from "../redux/actions/editDeckActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

const initialState = {
  deckName: "",
  deckDescription: "",
  deckImage: null,
  deckCards: [],
  imageUrl: null,
  dialogOpen: false,
  private: false
};

export class editDeck extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
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

  componentDidMount() {
    this.props.getDeck(this.props.match.params.deckId);
  }

  componentDidUpdate(prevProps) {
    // Load deck data after getDeck()
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
          deckImage: this.props.deckEdit.deckImage,
          private: this.props.deckEdit.private
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.clearStatus();
  }

  // Used to communicate with DeckTable
  updateDeckCards(cards) {
    this.setState({
      deckCards: cards
    });
  }

  deleteDeck() {
    this.setState(initialState);
    this.props.deleteDeck(this.props.match.params.deckId);
    this.handleDialogClose();
  }

  uploadDeck() {
    let deckData = {
      deckName: this.state.deckName,
      deckDescription: this.state.deckDescription,
      deckCards: this.state.deckCards,
      private: this.state.private
    };

    // Add deck image
    if (this.state.deckImage) {
      const imageFormData = new FormData();
      imageFormData.append("deckImage", this.state.deckImage, this.state.deckImage.name);
      deckData.imageFormData = imageFormData;
    }

    this.props.updateDeck(deckData, this.props.match.params.deckId);
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
    const {
      uiStatus: { status, errorCodes, successCodes }
    } = this.props;
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid item sm={10} lg={10} xl={10}>
            <Paper>
              <div style={{ padding: "25px 50px" }}>
                {status == "BUSY" && (
                  <React.Fragment>
                    <LinearProgress color="secondary" />
                    <Typography variant="h5" color="secondary" align="right">
                      Loading...
                    </Typography>
                  </React.Fragment>
                )}
                {successCodes.includes("updateDeck/deck-deleted") ? (
                  <Typography variant="h5" color="secondary" align="center">
                    Deck was deleted!
                  </Typography>
                ) : errorCodes.includes("deck/deck-not-found") ? (
                  <Typography variant="h5" color="error" align="center">
                    Error 404: Deck not found!
                  </Typography>
                ) : (
                  <React.Fragment>
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
                              <input type="file" id="imageInput" hidden="hidden" onChange={this.handleImageChange} />
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
                              <input type="file" id="imageInput" hidden="hidden" onChange={this.handleImageChange} />
                              <Typography style={{ textAlign: "center" }} variant="body2">
                                <Photo></Photo>
                                CHOOSE COVER (OPTIONAL)
                              </Typography>
                            </Button>
                          )}
                        </Grid>
                        <Grid>
                          <Box style={{ marginBottom: "20px" }}>
                            <TextField
                              variant="outlined"
                              label="Enter Title"
                              name="deckName"
                              value={this.state.deckName}
                              onChange={this.handleChange}
                              helperText={
                                errorCodes.includes("updateDeck/empty-deck-name")
                                  ? "Deck name must not be empty!"
                                  : errorCodes.includes("updateDeck/invalid-deck-name")
                                  ? "Invalid deck name!"
                                  : ""
                              }
                              error={
                                errorCodes.includes("updateDeck/empty-deck-name") ? true : errorCodes.includes("updateDeck/invalid-deck-name") ? true : false
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
                              name="deckDescription"
                              value={this.state.deckDescription ? this.state.deckDescription : ""}
                              onChange={this.handleChange}
                              InputLabelProps={{
                                shrink: true
                              }}
                            ></TextField>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid item sm={3} lg={3} xl={3} container direction="column" justify="flex-start" alignItems="flex-end">
                        <Grid item container justify="flex-end" alignItems="flex-start">
                          <IconButton color="primary" variant="contained" onClick={this.handleDialogOpen}>
                            <Delete></Delete>
                          </IconButton>
                          <Button size="large" color="secondary" variant="contained" onClick={this.uploadDeck}>
                            Save
                          </Button>

                          <FormControl variant="outlined" fullWidth>
                            <FormLabel>Deck visibility</FormLabel>
                            <Select name="private" value={this.state.private} onChange={this.handleChange}>
                              <MenuItem value={false}>Public</MenuItem>
                              <MenuItem value={true}>Private</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid>
                          {errorCodes.includes("updateDeck/empty-deck") ? (
                            <Typography align="right" color="error">
                              There must be at least 1 card!
                            </Typography>
                          ) : (
                            successCodes.includes("updateDeck/deck-updated") && (
                              <Typography variant="h6" align="right" color="secondary">
                                Upload was successful!
                              </Typography>
                            )
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <br />
                    <DeckTable data={this.state.deckCards} updateDeckCards={this.updateDeckCards}></DeckTable>
                  </React.Fragment>
                )}
              </div>
            </Paper>
          </Grid>
        </Grid>
        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle>Delete Deck</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this deck forever? <br />
              You can't undo this action.
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button onClick={this.handleDialogClose} color="primary" variant="outlined" autoFocus>
              Cancel
            </Button>
            <Button onClick={this.deleteDeck} color="primary" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

editDeck.propTypes = {
  deleteDeck: PropTypes.func.isRequired,
  deleteDeckDraft: PropTypes.func.isRequired,
  updateDeck: PropTypes.func.isRequired,
  getDeck: PropTypes.func.isRequired,
  deckEdit: PropTypes.object.isRequired,
  uiStatus: PropTypes.object.isRequired,
  clearStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  deckEdit: state.deckEdit,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  deleteDeck,
  deleteDeckDraft,
  updateDeck,
  getDeck,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(editDeck);
