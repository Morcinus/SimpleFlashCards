import React, { Component } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Bookmarks from "@material-ui/icons/Bookmarks";
import MenuBook from "@material-ui/icons/MenuBook";
import FitnessCenter from "@material-ui/icons/FitnessCenter";

import DeckInfo from "../components/DeckInfo";

// Redux
import { connect } from "react-redux";
import { getDeck, clearDeck } from "../redux/actions/deckUiActions";

export class deck extends Component {
  constructor() {
    super();
    this.state = {
      selectedTabIndex: 0
    };
  }

  handleChange = (event, newValue) => {
    this.setState({
      selectedTabIndex: newValue
    });
  };

  componentDidMount() {
    this.props.getDeck(this.props.match.params.deckId);
  }

  componentWillUnmount() {
    this.props.clearDeck();
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
          <Grid item sm={3} lg={3} xl={3}>
            <DeckInfo deck={this.props.deckUi.deck}></DeckInfo>
          </Grid>
          <Grid item sm={9} lg={9} xl={9}>
            <Paper>
              <div style={{ padding: "25px 50px" }}>
                <div>
                  <Tabs
                    value={this.state.selectedTabIndex}
                    onChange={this.handleChange}
                  >
                    <Tab
                      label={
                        <div>
                          <LibraryBooks
                            item
                            style={{
                              display: "inline-block",
                              marginBottom: "-5px",
                              marginRight: 5
                            }}
                          />
                          Learn
                        </div>
                      }
                      to="/decks"
                    />
                    <Tab
                      label={
                        <div>
                          <Bookmarks
                            item
                            style={{
                              display: "inline-block",
                              marginBottom: "-5px",
                              marginRight: 5
                            }}
                          />
                          Cards
                        </div>
                      }
                      to="/create"
                    />
                  </Tabs>
                </div>
                <Divider></Divider>
                <br />

                {this.state.selectedTabIndex === 1 ? (
                  <div>ta1</div>
                ) : (
                  learnButtons()
                )}

                <br />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

function learnButtons() {
  return (
    <Grid container direction="row" justify="space-evenly" alignItems="center">
      <Card
        variant="outlined"
        style={{
          width: "175px",
          height: "175px",
          marginRight: "20px",
          backgroundColor: "#bff27e",
          alignItems: "center"
        }}
      >
        <CardActionArea
          style={{ width: "100%", height: "100%", textAlign: "center" }}
        >
          <MenuBook style={{ fontSize: 75, color: "#37474f" }}></MenuBook>
          <Typography style={{ fontWeight: "bold", color: "#37474f" }}>
            LEARN NEW
          </Typography>
        </CardActionArea>
      </Card>
      <Card
        variant="outlined"
        style={{
          width: "200px",
          height: "200px",
          marginRight: "20px",
          backgroundColor: "#91cc47"
        }}
      >
        <CardActionArea
          style={{ width: "100%", height: "100%", textAlign: "center" }}
        >
          <MenuBook style={{ fontSize: 75, color: "#37474f" }}></MenuBook>
          <FitnessCenter
            style={{ fontSize: 75, color: "#37474f" }}
          ></FitnessCenter>
          <Typography style={{ fontWeight: "bold", color: "#37474f" }}>
            LEARN & REVIEW
          </Typography>
        </CardActionArea>
      </Card>
      <Card
        variant="outlined"
        style={{
          width: "175px",
          height: "175px",
          marginRight: "20px",
          backgroundColor: "#bff27e"
        }}
      >
        <CardActionArea
          style={{ width: "100%", height: "100%", textAlign: "center" }}
        >
          <FitnessCenter
            style={{ fontSize: 75, color: "#37474f" }}
          ></FitnessCenter>
          <Typography style={{ fontWeight: "bold", color: "#37474f" }}>
            REVIEW OLD
          </Typography>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

deck.propTypes = {
  getDeck: PropTypes.func.isRequired,
  clearDeck: PropTypes.func.isRequired,
  deckUi: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  deckUi: state.deckUi
});

const mapActionsToProps = {
  getDeck,
  clearDeck
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(deck);
