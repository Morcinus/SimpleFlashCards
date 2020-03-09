import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import Input from "@material-ui/core/Input";
import Box from "@material-ui/core/Box";
import MUILink from "@material-ui/core/Link";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import ShareIcon from "@material-ui/icons/Share";
import EditIcon from "@material-ui/icons/Edit";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import LockIcon from "@material-ui/icons/Lock";
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import Hidden from "@material-ui/core/Hidden";

// Other
import defaultDeckImageUrl from "../util/other";

// Redux
import { connect } from "react-redux";
import { pinDeck, unpinDeck } from "../redux/actions/deckUiActions";
import { openCollectionDialog } from "../redux/actions/colUiActions";

/**
 * @function styles
 * @memberof DeckInfo
 * @description Určuje CSS pro daný komponent.
 * @param {Object} theme - Theme (CSS) celé aplikace.
 */
const styles = theme => ({
  descriptionGrid: {
    [theme.breakpoints.down("md")]: {
      flexDirection: "row"
    }
  }
});

/**
 * @class DeckInfo
 * @extends Component
 * @category Components
 * @classdesc Tento komponent zobrazuje informace o balíčku na stránce daného balíčku. Komponent umožňuje balíček sdílet, připnout ho, přidat ho do kolekce, nebo ho případně upravit.
 * @param {Object} props - Vstupní data pro daný komponent.
 * @property {Object} state - Vnitřní state komponentu.
 * @property {boolean} state.popoverOpen - Určuje, zda-li je otevřeno vyskakovací okno na sdílení balíčku.
 * @property {element} state.anchorEl - Obsahuje element, ke kterému se má přichytit vyskakovací okno při sdílení balíčku.
 * @property {boolean} state.copiedLink - Určuje, zda-li uživatel zkopíroval odkaz na tento balíček.
 * @property {boolean} state.isPinned - Určuje, zda-li je balíček připnut uživatelem.
 *
 * @requires colUiActions~openCollectionDialog
 * @requires deckUiActions~pinDeck
 * @requires deckUiActions~unpinDeck
 * @requires {@link module:store~reducers module:store~reducers.deckUi}
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 */
export class DeckInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
      anchorEl: null,
      copiedLink: false,
      isPinned: false
    };
    this.handlePinButtonClick = this.handlePinButtonClick.bind(this);
    this.handleAddToCollection = this.handleAddToCollection.bind(this);
  }

  /**
   * @function handleCopyClick
   * @memberOf DeckInfo
   * @description Zkopíruje do schránky odkaz na balíček.
   * @param {string} elementId - ID vyskakovacího okna.
   */
  handleCopyClick = elementId => {
    // Zdroj: https://stackoverflow.com/questions/39501289/in-reactjs-how-to-copy-text-to-clipboard
    let textField = document.createElement("textarea");
    textField.innerText = `${window.location.href}`;
    let parentElement = document.getElementById(elementId);
    parentElement.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    parentElement.removeChild(textField);

    this.setState({
      copiedLink: true
    });
  };

  /**
   * @function handlePopoverOpen
   * @memberOf DeckInfo
   * @description Otevře vyskakovací okno na sdílení balíčku.
   * @param {event} event - Událost, která vyvolala spuštění této funkce.
   */
  handlePopoverOpen = event => {
    this.setState({
      popoverOpen: true,
      anchorEl: event.currentTarget
    });
  };

  /**
   * @function handlePopoverClose
   * @memberOf DeckInfo
   * @description Zavře vyskakovací okno na sdílení balíčku.
   */
  handlePopoverClose = () => {
    this.setState({
      popoverOpen: false
    });
  };

  /**
   * @function handlePinButtonClick
   * @memberOf DeckInfo
   * @description Nastaví isPinned v state tohoto komponentu na druhou hodnotu.
   */
  handlePinButtonClick() {
    let prevIsPinned = this.state.isPinned;
    this.setState({
      isPinned: !prevIsPinned
    });
  }

  /**
   * @function handleAddToCollection
   * @memberOf DeckInfo
   * @description Otevře dialogové okno pro přidávání balíčku do kolekcí.
   */
  handleAddToCollection() {
    this.props.openCollectionDialog();
  }

  /**
   * @function componentDidUpdate
   * @memberOf DeckInfo
   * @description Po stažení dat balíčku ze serveru uloží hodnotu isPinned do state tohoto komponentu.
   * @param {Object} prevProps - Předchozí props daného komponentu.
   */
  componentDidUpdate(prevProps) {
    if (this.props.deckUi.deck) {
      if (this.props.deckUi.deck !== prevProps.deckUi.deck) {
        this.setState({
          isPinned: this.props.deckUi.deck.isPinned
        });
      }
    }
  }

  /**
   * @function componentWillUnmount
   * @memberOf DeckInfo
   * @description Pokud byla změněna hodnota isPinned, nahraje změnu na server. Tím buď připne nebo odepne daný balíček.
   */
  componentWillUnmount() {
    if (this.props.deckUi.deck) {
      if (this.props.deckUi.deck.isPinned !== this.state.isPinned) {
        if (this.state.isPinned) {
          this.props.pinDeck(this.props.deckId);
        } else {
          this.props.unpinDeck(this.props.deckId);
        }
      }
    }
  }

  render() {
    const {
      classes,
      uiStatus: { status }
    } = this.props;
    return (
      <Grid>
        {status === "BUSY" && (
          <React.Fragment>
            <Card
              variant="outlined"
              style={{
                width: "174px",
                height: "204px",
                backgroundColor: "#d9d9d9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <CircularProgress />
            </Card>
          </React.Fragment>
        )}
        {status === "SUCCESS" && this.props.deckUi.deck && (
          <Grid>
            <Grid className={classes.descriptionGrid} container spacing={2}>
              <Grid item>
                <Card
                  variant="outlined"
                  style={{
                    width: "174px",
                    height: "204px"
                  }}
                >
                  <CardMedia
                    style={{ width: "100%", height: "100%" }}
                    image={this.props.deckUi.deck.deckImage ? this.props.deckUi.deck.deckImage : defaultDeckImageUrl}
                  ></CardMedia>
                </Card>
              </Grid>

              <Grid item>
                <Typography variant="h5">
                  {this.props.deckUi.deck.private && <LockIcon></LockIcon>}
                  {this.props.deckUi.deck.deckName}
                </Typography>

                <Typography>{this.props.deckUi.deck.deckDescription}</Typography>

                <br />

                <Typography>
                  Created by:
                  <MUILink to={`/user/${this.props.deckUi.deck.creatorName}`} component={Link}>
                    {this.props.deckUi.deck.creatorName}
                  </MUILink>
                </Typography>
              </Grid>
            </Grid>

            <Hidden smDown>
              <br />
              <Divider></Divider>
            </Hidden>

            <Grid direction="row" container style={{ marginTop: "20px" }} spacing={1}>
              <Grid item xs={3} md={12} lg={6} container justify="center">
                <Button variant={this.state.isPinned ? "contained" : "outlined"} color="primary" size="large" onClick={this.handlePinButtonClick}>
                  {this.state.isPinned ? (
                    <Fragment>
                      <BookmarkIcon /> <Typography> Pinned</Typography>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <BookmarkBorderIcon /> <Typography> Pin</Typography>
                    </Fragment>
                  )}
                </Button>
              </Grid>

              <Grid item xs={3} md={12} lg={6} container justify="center">
                <Button onClick={this.handlePopoverOpen} variant="outlined" color="primary" size="large">
                  <ShareIcon /> <Typography> Share</Typography>
                </Button>
              </Grid>
              <Popover
                open={this.state.popoverOpen}
                anchorEl={this.state.anchorEl}
                onClose={this.handlePopoverClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center"
                }}
              >
                <Box style={{ margin: "20px" }} id="popover">
                  <Typography style={{ fontWeight: "bold", color: "#37474f" }}>Share this deck</Typography>
                  <Input defaultValue={`${window.location.href}`} readOnly={true} style={{ color: "#808080" }} />
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Box item flexGrow={1}>
                      <Typography style={{ color: "#37474f" }}>{this.state.copiedLink ? "Copied!" : ""}</Typography>
                    </Box>
                    <Button item color="secondary" style={{ fontWeight: "bold" }} onClick={() => this.handleCopyClick("popover")}>
                      Copy link
                    </Button>
                  </Grid>
                </Box>
              </Popover>

              <Grid item xs={3} md={12} lg={6} container justify="center">
                {this.props.deckUi.deck.isCreator && (
                  <Button variant="text" color="primary" component={Link} to={`/editDeck/${this.props.deckId}`}>
                    <EditIcon style={{ marginRight: "5px" }} />
                    <Typography variant="body2">
                      Edit <br /> Deck
                    </Typography>
                  </Button>
                )}
              </Grid>

              <Grid item xs={3} md={12} lg={6} container justify="center">
                <Button variant="text" color="primary" onClick={this.handleAddToCollection}>
                  <LibraryAddIcon style={{ marginRight: "5px" }} />
                  <Typography variant="body2">
                    Add to <br /> Collection
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  }
}

DeckInfo.propTypes = {
  pinDeck: PropTypes.func.isRequired,
  unpinDeck: PropTypes.func.isRequired,
  openCollectionDialog: PropTypes.func.isRequired,
  deckUi: PropTypes.object.isRequired,
  uiStatus: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  deckUi: state.deckUi,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  pinDeck,
  unpinDeck,
  openCollectionDialog
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(DeckInfo));
