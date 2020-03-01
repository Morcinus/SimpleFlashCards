import React, { Component } from "react";
import PropTypes from "prop-types";
import DeckTable from "../components/DeckTable";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Divider, TextField, Box, Button } from "@material-ui/core";
import PhotoIcon from "@material-ui/icons/Photo";
import DeleteIcon from "@material-ui/icons/Delete";
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
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import { deleteDeck, deleteDeckDraft, updateDeck, getDeck } from "../redux/actions/editDeckActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

/**
 * @function styles
 * @memberof editDeck
 * @description Určuje CSS pro daný komponent.
 * @param {Object} theme - Theme (CSS) celé aplikace.
 */
const styles = theme => ({
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
  deckName: "",
  deckDescription: "",
  deckImage: null,
  deckCards: [],
  imageUrl: null,
  dialogOpen: false,
  private: false
};

/**
 * @class editDeck
 * @extends Component
 * @category Pages
 * @classdesc Na této stránce může uživatel upravovat balíček a následně nahrát novou verzi balíčku na server.
 * @param {Object} props - Vstupní data pro daný komponent.
 * @property {Object} state - Vnitřní state komponentu.
 * @property {string} state.deckName - Uchovává název balíčku.
 * @property {string} state.deckDescription - Uchovává popis balíčku.
 * @property {Object} state.deckImage - Uchovává obrázek balíčku.
 * @property {Array<Object>} state.deckCards - Uchovává karty balíčku.
 * @property {string} state.imageUrl - Uchovává adresu obrázku balíčku.
 * @property {boolean} state.private - Uchovává informaci, zda je balíček veřejný či soukromý.
 * @property {boolean} state.dialogOpen - Uchovává informaci, zda je dialogové okno otevřené či zavřené.
 *
 * @requires editDeckActions~deleteDeck
 * @requires editDeckActions~deleteDeckDraft
 * @requires editDeckActions~updateDeck
 * @requires editDeckActions~getDeck
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 * @requires {@link module:store~reducers module:store~reducers.deckEdit}
 */
export class editDeck extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.updateDeckCards = this.updateDeckCards.bind(this);
    this.handleUploadButtonClick = this.handleUploadButtonClick.bind(this);
    this.deleteDeck = this.deleteDeck.bind(this);
    this.uploadDeck = this.uploadDeck.bind(this);
  }

  /**
   * @function handleChange
   * @memberOf editDeck
   * @description Přepisuje data v state tohoto komponentu na základě uživatelských změn při upravování balíčku.
   * @param {event} event - Event, který vyvolal spuštění této funkce.
   */
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  /**
   * @function componentDidMount
   * @memberOf editDeck
   * @description Stáhne data balíčku ze serveru.
   */
  componentDidMount() {
    this.props.getDeck(this.props.match.params.deckId);
  }

  /**
   * @function componentDidUpdate
   * @memberOf editDeck
   * @description Po stažení dat balíčku ze serveru je uloží do state tohoto komponentu.
   * @param {Object} prevProps - Předchozí props daného komponentu.
   */
  componentDidUpdate(prevProps) {
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

  /**
   * @function componentWillUnmount
   * @memberOf editDeck
   * @description Vymaže status aplikace v reduceru.
   */
  componentWillUnmount() {
    this.props.clearStatus();
  }

  /**
   * @function updateDeckCards
   * @memberOf editDeck
   * @description Přepisuje seznam karet balíčku na základě změn v tabulce karet.
   * @param {Array<Object>} cards - Seznam karet v daném balíčku.
   */
  updateDeckCards(cards) {
    this.setState({
      deckCards: cards
    });
  }

  /**
   * @function deleteDeck
   * @memberOf editDeck
   * @description Pošle na server požadavek o smazání balíčku a vymaže state komponentu.
   */
  deleteDeck() {
    this.setState(initialState);
    this.props.deleteDeck(this.props.match.params.deckId);
    this.handleDialogClose();
  }

  /**
   * @function uploadDeck
   * @memberOf editDeck
   * @description Nahraje novou verzi balíčku na server.
   */
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

  /**
   * @function handleImageChange
   * @memberOf editDeck
   * @description Pokud byl nahrán nový obrázek, změní data o obrázku v state tohoto komponentu.
   * @param {event} event - Event, který vyvolal spuštění této funkce.
   */
  handleImageChange = event => {
    if (event.target.files[0]) {
      this.setState({
        deckImage: event.target.files[0],
        imageUrl: URL.createObjectURL(event.target.files[0])
      });
    }
  };

  /**
   * @function handleUploadButtonClick
   * @memberOf editDeck
   * @description Pokud uživatel kliknul na obrázek balíčku, otevře okno pro nahrání obrázku.
   */
  handleUploadButtonClick() {
    document.getElementById("imageInput").click();
  }

  /**
   * @function handleDialogOpen
   * @memberOf editDeck
   * @description Otevře dialogové okno tím, že nastaví ve state komponentu dialogOpen na true.
   */
  handleDialogOpen = () => {
    this.setState({
      dialogOpen: true
    });
  };

  /**
   * @function handleDialogClose
   * @memberOf editDeck
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
                      <Grid item sm={12} md={9} lg={9} xl={9} container direction="row">
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
                                <PhotoIcon></PhotoIcon>
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
                      <Grid item sm={12} md={3} lg={3} xl={3} container>
                        <Grid className={classes.grid} item container>
                          <Box className={classes.box}>
                            <IconButton color="primary" variant="contained" onClick={this.handleDialogOpen}>
                              <DeleteIcon></DeleteIcon>
                            </IconButton>
                            <Button size="large" color="secondary" variant="contained" onClick={this.uploadDeck}>
                              Save
                            </Button>
                          </Box>

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
  clearStatus: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
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

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(editDeck));
