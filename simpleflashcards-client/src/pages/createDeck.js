import React, { Component } from "react";
import PropTypes from "prop-types";
import DeckTable from "../components/DeckTable";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Divider, Card, CardContent, TextField, Box, Button } from "@material-ui/core";
import Photo from "@material-ui/icons/Photo";
import Delete from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormLabel from "@material-ui/core/FormLabel";
import LinearProgress from "@material-ui/core/LinearProgress";

// Redux
import { connect } from "react-redux";
import { saveDeckDraft, deleteDeckDraft, uploadDeck } from "../redux/actions/createDeckActions";
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

export class createDeck extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.updateDeckCards = this.updateDeckCards.bind(this);
    this.handleUploadButtonClick = this.handleUploadButtonClick.bind(this);
    this.deleteDeckDraft = this.deleteDeckDraft.bind(this);
    this.uploadDeck = this.uploadDeck.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  componentDidMount() {
    this.setState({
      deckName: this.props.deckCreation.deckName,
      deckDescription: this.props.deckCreation.deckDescription,
      deckImage: this.props.deckCreation.deckImage,
      deckCards: this.props.deckCreation.deckCards,
      imageUrl: this.props.deckCreation.imageUrl,
      private: this.props.deckCreation.private
    });
  }

  componentWillUnmount() {
    let deckData = {
      deckName: this.state.deckName,
      deckDescription: this.state.deckDescription,
      deckImage: this.state.deckImage,
      deckCards: this.state.deckCards,
      imageUrl: this.state.imageUrl,
      private: this.state.private
    };
    this.props.saveDeckDraft(deckData);
    this.props.clearStatus();
  }

  // Used to communicate with DeckTable
  updateDeckCards(cards) {
    this.setState({
      deckCards: cards
    });
  }

  deleteDeckDraft() {
    this.setState(initialState);
    this.props.deleteDeckDraft();
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

    this.props.uploadDeck(deckData);
  }

  componentDidUpdate(prevProps) {
    // Remove data if the deck was created
    if (this.props.uiStatus.status) {
      if (this.props.uiStatus.successCodes !== prevProps.uiStatus.successCodes) {
        if (this.props.uiStatus.successCodes.includes("createDeck/deck-created")) {
          this.setState(initialState);
        }
      }
    }
  }

  handleImageChange = event => {
    this.setState({
      deckImage: event.target.files[0],
      imageUrl: URL.createObjectURL(event.target.files[0])
    });
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
                <Typography variant="h4">Create new deck</Typography>
                <Divider></Divider>
                <br />
                <Grid container>
                  <Grid item sm={9} lg={9} xl={9} container direction="row">
                    <Grid>
                      {this.state.deckImage ? (
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
                            errorCodes.includes("createDeck/empty-deck-name")
                              ? "Deck name must not be empty!"
                              : errorCodes.includes("createDeck/invalid-deck-name")
                              ? "Invalid deck name!"
                              : ""
                          }
                          error={errorCodes.includes("createDeck/empty-deck-name") ? true : errorCodes.includes("createDeck/invalid-deck-name") ? true : false}
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
                          value={this.state.deckDescription}
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
                        Create
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
                      {errorCodes.includes("createDeck/empty-deck") ? (
                        <Typography align="right" color="error">
                          There must be at least 1 card!
                        </Typography>
                      ) : (
                        successCodes.includes("createDeck/deck-created") && (
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
              </div>
            </Paper>
          </Grid>
        </Grid>
        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle>{"Are you sure you want to delete this draft?"}</DialogTitle>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button onClick={this.handleDialogClose} color="primary" variant="outlined" autoFocus>
              Cancel
            </Button>
            <Button onClick={this.deleteDeckDraft} color="primary" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

createDeck.propTypes = {
  saveDeckDraft: PropTypes.func.isRequired,
  deleteDeckDraft: PropTypes.func.isRequired,
  uploadDeck: PropTypes.func.isRequired,
  deckCreation: PropTypes.object.isRequired,
  uiStatus: PropTypes.object.isRequired,
  clearStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  deckCreation: state.deckCreation,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  saveDeckDraft,
  deleteDeckDraft,
  uploadDeck,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(createDeck);
