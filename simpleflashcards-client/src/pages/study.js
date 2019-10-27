import React, { Component } from "react";

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
import MenuBook from "@material-ui/icons/MenuBook";
import FitnessCenter from "@material-ui/icons/FitnessCenter";
import { minHeight } from "@material-ui/system";

export class study extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardSide: true, // false = front; true = back
      cardProgress: [],
      cardArrayIndex: 0
    };
  }

  // Flips card to front
  setCardSideToFront() {
    this.setState({
      cardSide: false
    });
  }

  // Flips card to back
  setCardSideToBack() {
    this.setState({
      cardSide: true
    });
  }

  // Hard
  setCardProgressWrong() {
    this.setCardSideToFront();
    this.setState(prevState => ({
      cardProgress: [
        ...prevState.cardProgress,
        {
          //cardId: this.props.vocab.cards[this.state.cardIndex].cardId,
          //   understandingLevel:
          //     parseInt(
          //       this.props.vocab.cards[this.state.cardIndex].understandingLevel
          //     ) - 2 // Osetrit na backendu, aby nebylo mensi nez nula - nebo tady
        }
      ],
      cardArrayIndex: prevState.cardArrayIndex + 1
    }));
  }

  render() {
    return (
      <div className="rootContainer">
        <Grid
          container
          justify="center"
          spacing={3}
          style={{ marginLeft: "20px" }}
        >
          <Grid item sm={2} lg={2} xl={2}></Grid>
          <Grid item sm={8} lg={8} xl={8}>
            <Paper>
              <div style={{ padding: "10px 15px 0px 15px" }}>
                <Box display="flex" flexWrap="nowrap">
                  <Box>
                    <IconButton>
                      <Close />
                    </IconButton>
                  </Box>
                  <Box flexGrow={1} alignSelf="center">
                    <LinearProgress
                      color="secondary"
                      variant="determinate"
                      value={80}
                    />
                  </Box>
                </Box>

                <br />
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                >
                  {flashCard(this.state.cardSide)}
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
                          onClick={this.setCardProgress3}
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
                          onClick={this.setCardProgress3}
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
                          onClick={this.setCardProgress3}
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
                          onClick={this.setCardProgress3}
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
                <br />
              </div>
            </Paper>
          </Grid>
          <Grid item sm={2} lg={2} xl={2}></Grid>
        </Grid>
      </div>
    );
  }
}

function flashCard(cardSide) {
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
      >
        <Typography variant="h4" style={{ color: "#37474f" }}>
          REVIEW OLD
        </Typography>
      </CardActionArea>
    </Card>
  );
}

export default study;
