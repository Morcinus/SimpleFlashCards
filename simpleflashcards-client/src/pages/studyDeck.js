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
import { getLearnAndReviewDeck, getLearnDeck, getReviewDeck, pushDeckProgress, clearStudyDeck } from "../redux/actions/deckStudyActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

// QueryString
const queryString = require("query-string");

export class studyDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardSide: false, // false = front; true = back
      cardProgress: [],
      cardArrayIndex: 0,
      deckFinished: false,
      dialogOpen: false
    };
    this.flipCard = this.flipCard.bind(this);
    this.checkDeckFinished = this.checkDeckFinished.bind(this);
  }

  // Flips card to front
  setCardSideToFront() {
    this.setState({
      cardSide: false
    });
  }

  // Flips card
  flipCard() {
    let currentCardSide = this.state.cardSide;
    this.setState({
      cardSide: !currentCardSide
    });
  }

  // Sets card progress
  setCardProgress(buttonIndex) {
    let understandingLevel = this.props.deckStudy.currentDeck[this.state.cardArrayIndex].understandingLevel
      ? this.props.deckStudy.currentDeck[this.state.cardArrayIndex].understandingLevel
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
            cardId: this.props.deckStudy.currentDeck[prevState.cardArrayIndex].cardId,
            understandingLevel: understandingLevel
          }
        ],
        cardArrayIndex: prevState.cardArrayIndex + 1
      }),
      () => {
        this.checkDeckFinished();
      }
    );
  }

  checkDeckFinished() {
    if (this.state.cardArrayIndex >= this.props.deckStudy.currentDeck.length) {
      this.setState({
        deckFinished: true
      });
      this.props.pushDeckProgress(this.props.match.params.deckId, this.state.cardProgress);
    }
  }

  componentDidMount() {
    // Parse query string
    let parsedQueryString = queryString.parse(this.props.location.search);

    // Gets deck from the database
    switch (parsedQueryString.lessonType) {
      case "study":
        this.props.getLearnAndReviewDeck(this.props.match.params.deckId);
        break;
      case "learn":
        this.props.getLearnDeck(this.props.match.params.deckId);
        break;
      case "review":
        this.props.getReviewDeck(this.props.match.params.deckId);
        break;
      default:
        this.props.getLearnAndReviewDeck(this.props.match.params.deckId);
    }
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

  handleQuit = () => {
    this.props.clearStudyDeck();
    this.props.history.push("/home");
  };

  componentWillUnmount() {
    this.props.clearStatus();
  }

  render() {
    const {
      uiStatus: { status, errorCodes, successCodes }
    } = this.props;
    return (
      <div className="rootContainer">
        <Grid container justify="center" spacing={3} style={{ marginLeft: "20px" }}>
          <Grid item sm={2} lg={2} xl={2}></Grid>
          <Grid item sm={8} lg={8} xl={8}>
            <Paper>
              <div style={{ padding: "10px 15px 0px 15px" }}>
                <Box display="flex" flexWrap="nowrap">
                  <Box>
                    {this.state.deckFinished ? (
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
                        value={(this.state.cardArrayIndex / this.props.deckStudy.currentDeck.length) * 100}
                      />
                    </Box>
                  )}
                </Box>

                <br />

                {this.state.deckFinished ? (
                  <h4>Congratulations! Studying finished.</h4>
                ) : (
                  status !== "BUSY" &&
                  (this.props.deckStudy.currentDeck.length > 0 ? (
                    <Grid container direction="column" justify="center" alignItems="center">
                      {flashCard(this.props.deckStudy.currentDeck[this.state.cardArrayIndex], this.state.cardSide, this.flipCard)}
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
          <Grid item sm={2} lg={2} xl={2}></Grid>
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

function flashCard(card, cardSide, cardFlipFunciton) {
  return (
    <Card
      variant="outlined"
      style={{
        width: "350px",
        height: "350px",
        backgroundColor: "#fff0c7"
      }}
    >
      <CardActionArea
        style={{
          width: "100%",
          height: "100%",
          textAlign: "center"
        }}
        onClick={cardFlipFunciton}
      >
        <Typography variant="h4" style={{ color: "#37474f" }}>
          {!cardSide ? (card ? card.body1 : "loading...") : card ? card.body2 : "loading..."}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

studyDeck.propTypes = {
  getLearnAndReviewDeck: PropTypes.func.isRequired,
  getLearnDeck: PropTypes.func.isRequired,
  getReviewDeck: PropTypes.func.isRequired,
  pushDeckProgress: PropTypes.func.isRequired,
  clearStudyDeck: PropTypes.func.isRequired,
  deckUi: PropTypes.object.isRequired,
  deckStudy: PropTypes.object.isRequired,
  uiStatus: PropTypes.object.isRequired,
  clearStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  deckUi: state.deckUi,
  deckStudy: state.deckStudy,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  pushDeckProgress,
  getLearnAndReviewDeck,
  getLearnDeck,
  getReviewDeck,
  clearStudyDeck,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(studyDeck);
