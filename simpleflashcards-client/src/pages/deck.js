import React, { Component } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Bookmarks from "@material-ui/icons/Bookmarks";

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
                  <div>ta2</div>
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
