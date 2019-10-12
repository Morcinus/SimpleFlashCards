import React, { Component } from "react";
import PropTypes from "prop-types";
import DeckTable from "../components/DeckTable";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {
  Divider,
  Card,
  CardContent,
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
  deleteDeckDraft,
  uploadDeck
} from "../redux/actions/createDeckActions";

const initialState = {
  errors: {},
  deckName: "",
  deckDescription: "",
  deckImage: null,
  deckCards: [],
  imageUrl: null,
  dialogOpen: false
};

export class create extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.updateDeckCards = this.updateDeckCards.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.deleteDeckDraft = this.deleteDeckDraft.bind(this);
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
    this.setState({
      deckName: this.props.deckCreation.deckName,
      deckDescription: this.props.deckCreation.deckDescription,
      deckImage: this.props.deckCreation.deckImage,
      deckCards: this.props.deckCreation.deckCards,
      imageUrl: this.props.deckCreation.imageUrl
    });
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
      deckImage: this.state.deckImage,
      deckCards: this.state.deckCards,
      imageUrl: this.state.imageUrl
    };

    const failed = this.props.uploadDeck(deckData);
    if (!failed) {
      this.setState(initialState);
    } else {
      this.setState({ uploadSucceeded: true });
    }
  }

  handleImageChange = event => {
    this.setState({
      deckImage: event.target.files[0],
      imageUrl: URL.createObjectURL(event.target.files[0])
    });
  };

  handleImageUpload() {
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
                          onClick={this.handleImageUpload}
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
                          onClick={this.handleImageUpload}
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
                        Create
                      </Button>
                    </Grid>
                    <Grid>
                      {this.state.errors.deckCardsError ? (
                        <Typography align="right" color="error">
                          {this.state.errors.deckCardsError}
                        </Typography>
                      ) : this.state.uploadSucceeded ? ( // NEEDS UPDATE!!! to disappear after few secs
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
            {"Are you sure you want to delete this draft?"}
          </DialogTitle>
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
              onClick={this.deleteDeckDraft}
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

create.propTypes = {
  saveDeckDraft: PropTypes.func.isRequired,
  deleteDeckDraft: PropTypes.func.isRequired,
  uploadDeck: PropTypes.func.isRequired,
  deckCreation: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  deckCreation: state.deckCreation,
  UI: state.UI
});

const mapActionsToProps = {
  saveDeckDraft,
  deleteDeckDraft,
  uploadDeck
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(create);
