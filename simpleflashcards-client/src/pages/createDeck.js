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
import DialogActions from "@material-ui/core/DialogActions";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormLabel from "@material-ui/core/FormLabel";
import LinearProgress from "@material-ui/core/LinearProgress";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import { saveDeckDraft, deleteDeckDraft, uploadDeck } from "../redux/actions/createDeckActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

/**
 * @function styles
 * @memberof createDeck
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
 * @class createDeck
 * @extends Component
 * @category Pages
 * @classdesc Na této stránce může uživatel vytvořit balíček a následně ho nahrát na server.
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
 * @requires createDeckActions~saveDeckDraft
 * @requires createDeckActions~deleteDeckDraft
 * @requires createDeckActions~uploadDeck
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 * @requires {@link module:store~reducers module:store~reducers.deckCreation}
 */
export class createDeck extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.updateDeckCards = this.updateDeckCards.bind(this);
    this.handleUploadButtonClick = this.handleUploadButtonClick.bind(this);
    this.deleteDeckDraft = this.deleteDeckDraft.bind(this);
    this.uploadDeck = this.uploadDeck.bind(this);
  }

  /**
   * @function handleChange
   * @memberOf createDeck
   * @description Přepisuje data v state tohoto komponentu na základě uživatelských změn při vytváření balíčku.
   * @param {event} event - Event, který vyvolal spuštění této funkce.
   */
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  /**
   * @function componentDidMount
   * @memberOf createDeck
   * @description Načte návrh balíčku, pokud předtím uživatel návrh balíčku neuložil na server nebo ho nesmazal.
   */
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

  /**
   * @function componentWillUnmount
   * @memberOf createDeck
   * @description Uloží návrh balíčku do reduceru a vymaže status aplikace v reduceru.
   */
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

  /**
   * @function updateDeckCards
   * @memberOf createDeck
   * @description Přepisuje seznam karet balíčku na základě změn v tabulce karet.
   * @param {Array<Object>} cards - Seznam karet v daném balíčku.
   */
  updateDeckCards(cards) {
    this.setState({
      deckCards: cards
    });
  }

  /**
   * @function deleteDeckDraft
   * @memberOf createDeck
   * @description Vymaže návrh balíčku z reduceru a ze state tohoto komponentu.
   */
  deleteDeckDraft() {
    this.setState(initialState);
    this.props.deleteDeckDraft();
    this.handleDialogClose();
  }

  /**
   * @function uploadDeck
   * @memberOf createDeck
   * @description Nahraje balíček na server.
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

    this.props.uploadDeck(deckData);
  }

  /**
   * @function componentDidUpdate
   * @memberOf createDeck
   * @description Pokud byl balíček úspěšně vytvořen na serveru, vymaže všechna data ze state komponentu.
   * @param {Object} prevProps - Předchozí props daného komponentu.
   */
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

  /**
   * @function handleImageChange
   * @memberOf createDeck
   * @description Pokud byl nahrán nový obrázek, změní data o obrázku v state tohoto komponentu.
   * @param {event} event - Event, který vyvolal spuštění této funkce.
   */
  handleImageChange = event => {
    this.setState({
      deckImage: event.target.files[0],
      imageUrl: URL.createObjectURL(event.target.files[0])
    });
  };

  /**
   * @function handleUploadButtonClick
   * @memberOf createDeck
   * @description Pokud uživatel kliknul na obrázek balíčku, otevře okno pro nahrání obrázku.
   */
  handleUploadButtonClick() {
    document.getElementById("imageInput").click();
  }

  /**
   * @function handleDialogOpen
   * @memberOf createDeck
   * @description Otevře dialogové okno tím, že nastaví ve state komponentu dialogOpen na true.
   */
  handleDialogOpen = () => {
    this.setState({
      dialogOpen: true
    });
  };

  /**
   * @function handleDialogClose
   * @memberOf createDeck
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
                <Typography variant="h4">Create new deck</Typography>
                <Divider></Divider>
                <br />
                <Grid container>
                  <Grid item sm={12} md={9} lg={9} xl={9} container direction="row">
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
                  <Grid item sm={12} md={3} lg={3} xl={3} container>
                    <Grid className={classes.grid} item container>
                      <Box className={classes.box}>
                        <IconButton color="primary" variant="contained" onClick={this.handleDialogOpen}>
                          <DeleteIcon></DeleteIcon>
                        </IconButton>
                        <Button size="large" color="secondary" variant="contained" onClick={this.uploadDeck}>
                          Create
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
  clearStatus: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
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

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(createDeck));
