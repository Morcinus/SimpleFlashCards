import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Close from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

// Redux
import { connect } from "react-redux";
import {
  getColCardsToLearnAndReview,
  getColLearnCards,
  getColReviewCards,
  pushCollectionProgress,
  clearStudyCollection
} from "../redux/actions/colStudyActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

// Other
import { flashCard } from "../util/functions";

// QueryString
const queryString = require("query-string");

/**
 * @class studyCollection
 * @extends Component
 * @category Pages
 * @classdesc Na této stránce uživatel může studovat karty v dané kolekci.
 * @property {Object} state - Vnitřní state komponentu
 * @property {boolean} state.cardSide - Jak je otočená kartička, kterou uživatel momentálně studuje. Pro hodnotu false uživatel vidí přední stranu, pro hodnotu true vidí zadní.
 * @property {Array<Object>} state.cardProgress - Uchovává informace o kartách a pokroku uživatele u každé z nich.
 * @property {number} state.cardArrayIndex - Uchovává informaci, kolikátou kartu z kolekce uživatel momentálně studuje.
 * @property {boolean} state.colFinished - Uchovává informaci, zda-li uživatel už prošel všechny karty ve stažené kolekci.
 * @property {boolean} state.dialogOpen - Uchovává informaci, zda je dialogové okno otevřené či zavřené.
 *
 * @requires functions~flashCard
 * @requires colStudyActions~getColCardsToLearnAndReview
 * @requires colStudyActions~getColLearnCards
 * @requires colStudyActions~getColReviewCards
 * @requires colStudyActions~pushCollectionProgress
 * @requires colStudyActions~clearStudyCollection
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 * @requires {@link module:store~reducers module:store~reducers.colStudy}
 */
export class studyCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardSide: false, // false = front; true = back
      cardProgress: [],
      cardArrayIndex: 0,
      colFinished: false,
      dialogOpen: false
    };
    this.flipCard = this.flipCard.bind(this);
    this.checkcolFinished = this.checkcolFinished.bind(this);
  }

  /**
   * @function setCardSideToFront
   * @memberOf studyCollection
   * @description Otočí kartu na přední stranu tím, že přepíše cardSide v state tohoto komponentu.
   */
  setCardSideToFront() {
    this.setState({
      cardSide: false
    });
  }

  /**
   * @function flipCard
   * @memberOf studyCollection
   * @description Otočí kartu na druhou stranu tím, že přepíše cardSide v state tohoto komponentu.
   */
  flipCard() {
    let currentCardSide = this.state.cardSide;
    this.setState({
      cardSide: !currentCardSide
    });
  }

  /**
   * @function setCardProgress
   * @memberOf studyCollection
   * @description Nastaví v cardProgress v state tohoto komponentu pokrok uživatele u dané karty.
   * @param {number} buttonIndex - Číslo tlačítka, na které uživatel kliknul. Podle toho se zapíše, jaký pokrok uživatel udělal.
   */
  setCardProgress(buttonIndex) {
    let understandingLevel = this.props.colStudy.currentColCards[this.state.cardArrayIndex].understandingLevel
      ? this.props.colStudy.currentColCards[this.state.cardArrayIndex].understandingLevel
      : 0;

    switch (buttonIndex) {
      case 0:
        // Wrong Button
        if (understandingLevel > 0) {
          understandingLevel = understandingLevel - 1;
        } else understandingLevel = 0;
        break;
      case 1:
        // Hard Button
        understandingLevel = understandingLevel;
        break;
      case 2:
        // Good Button
        understandingLevel = understandingLevel + 1;
        break;
      case 3:
        // Easy Button
        understandingLevel = understandingLevel + 2;
        break;
      default:
        understandingLevel = understandingLevel;
    }

    this.setCardSideToFront();
    this.setState(
      prevState => ({
        cardSide: false,
        cardProgress: [
          ...prevState.cardProgress,
          {
            cardId: this.props.colStudy.currentColCards[prevState.cardArrayIndex].cardId,
            deckId: this.props.colStudy.currentColCards[prevState.cardArrayIndex].deckId,
            understandingLevel: understandingLevel
          }
        ],
        cardArrayIndex: prevState.cardArrayIndex + 1
      }),
      () => {
        this.checkcolFinished();
      }
    );
  }

  /**
   * @function checkcolFinished
   * @memberOf studyCollection
   * @description Zkontroluje, zda-li uživatel prošel všechny karty v stažené kolekci. Pokud ano, nastaví colFinished v state tohoto komponentu na true a nahraje nový pokrok na server.
   */
  checkcolFinished() {
    if (this.state.cardArrayIndex >= this.props.colStudy.currentColCards.length) {
      this.setState({
        colFinished: true
      });
      this.props.pushCollectionProgress(this.state.cardProgress);
    }
  }

  /**
   * @function componentDidMount
   * @memberOf studyCollection
   * @description Na základě typu učení stáhne karty dané kolekce ze serveru.
   */
  componentDidMount() {
    // Parse query string
    let parsedQueryString = queryString.parse(this.props.location.search);

    // Gets collection from the database
    switch (parsedQueryString.lessonType) {
      case "study":
        this.props.getColCardsToLearnAndReview(this.props.match.params.colId);
        break;
      case "learn":
        this.props.getColLearnCards(this.props.match.params.colId);
        break;
      case "review":
        this.props.getColReviewCards(this.props.match.params.colId);
        break;
      default:
        this.props.getColCardsToLearnAndReview(this.props.match.params.colId);
    }
  }

  /**
   * @function handleDialogOpen
   * @memberOf studyCollection
   * @description Otevře dialogové okno tím, že nastaví ve state komponentu dialogOpen na true.
   */
  handleDialogOpen = () => {
    this.setState({
      dialogOpen: true
    });
  };

  /**
   * @function handleDialogClose
   * @memberOf studyCollection
   * @description Zavře dialogové okno tím, že nastaví ve state komponentu dialogOpen na false.
   */
  handleDialogClose = () => {
    this.setState({
      dialogOpen: false
    });
  };

  /**
   * @function handleQuit
   * @memberOf studyCollection
   * @description Vymaže data o studované kolekci a přesměruje uživatele na /home
   */
  handleQuit = () => {
    this.props.clearStudyCollection();
    this.props.history.push("/home");
  };

  componentWillUnmount() {
    this.props.clearStatus();
  }

  render() {
    const {
      uiStatus: { status }
    } = this.props;
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Paper>
              <div style={{ padding: "10px 15px 0px 15px" }}>
                <Box display="flex" flexWrap="nowrap">
                  <Box>
                    {this.state.colFinished ? (
                      <IconButton component={Link} to="/home">
                        <Close />
                      </IconButton>
                    ) : (
                      <IconButton onClick={this.handleDialogOpen}>
                        <Close />
                      </IconButton>
                    )}
                  </Box>
                  {status == "BUSY" ? (
                    <Box flexGrow={1} alignSelf="flex-end">
                      <LinearProgress color="secondary" />
                      <Typography variant="h5" color="secondary" align="right">
                        Loading...
                      </Typography>
                    </Box>
                  ) : (
                    <Box flexGrow={1} alignSelf="center">
                      <LinearProgress
                        color="secondary"
                        variant="determinate"
                        value={(this.state.cardArrayIndex / this.props.colStudy.currentColCards.length) * 100}
                      />
                    </Box>
                  )}
                </Box>

                <br />
                {this.state.colFinished ? (
                  <h4>Congratulations! Studying finished.</h4>
                ) : (
                  status !== "BUSY" &&
                  (this.props.colStudy.currentColCards.length > 0 ? (
                    <Grid container direction="column" justify="center" alignItems="center">
                      {flashCard(this.props.colStudy.currentColCards[this.state.cardArrayIndex], this.state.cardSide, this.flipCard)}
                      {this.state.cardSide === true ? (
                        <div style={{ minHeight: "85px" }}>
                          <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                            style={{
                              marginTop: "20px"
                            }}
                          >
                            <Button
                              size="large"
                              onClick={() => this.setCardProgress(0)}
                              style={{
                                margin: "10px",
                                backgroundColor: "#D32F2F",
                                color: "#ffffff"
                              }}
                            >
                              <strong>Wrong</strong>
                            </Button>
                            <Button
                              size="large"
                              onClick={() => this.setCardProgress(1)}
                              style={{
                                margin: "10px",
                                backgroundColor: "#455A64",
                                color: "#ffffff"
                              }}
                            >
                              <strong>Hard</strong>
                            </Button>
                            <Button
                              size="large"
                              onClick={() => this.setCardProgress(2)}
                              style={{
                                margin: "10px",
                                backgroundColor: "#4CAF50",
                                color: "#ffffff"
                              }}
                            >
                              <strong>Good</strong>
                            </Button>
                            <Button
                              size="large"
                              onClick={() => this.setCardProgress(3)}
                              style={{
                                margin: "10px",
                                backgroundColor: "#03A9F4",
                                color: "#ffffff"
                              }}
                            >
                              <strong>Easy</strong>
                            </Button>
                          </Grid>
                        </div>
                      ) : (
                        <div style={{ minHeight: "85px" }}></div>
                      )}
                    </Grid>
                  ) : (
                    <h4>There is nothing to learn! Try again later...</h4>
                  ))
                )}

                <br />
              </div>
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle>{"Are you sure you want to quit?"}</DialogTitle>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button onClick={this.handleQuit} color="secondary" variant="contained" size="large" autoFocus>
              <strong>Quit</strong>
            </Button>
            <Button onClick={this.handleDialogClose} color="secondary" variant="outlined" size="large">
              <strong>Cancel</strong>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

studyCollection.propTypes = {
  getColCardsToLearnAndReview: PropTypes.func.isRequired,
  getColLearnCards: PropTypes.func.isRequired,
  getColReviewCards: PropTypes.func.isRequired,
  pushCollectionProgress: PropTypes.func.isRequired,
  clearStudyCollection: PropTypes.func.isRequired,
  colStudy: PropTypes.object.isRequired,
  uiStatus: PropTypes.object.isRequired,
  clearStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  colStudy: state.colStudy,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  pushCollectionProgress,
  getColCardsToLearnAndReview,
  getColLearnCards,
  getColReviewCards,
  clearStudyCollection,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(studyCollection);
