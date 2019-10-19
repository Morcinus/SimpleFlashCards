import React, { Component } from "react";

// Components
import MyDecks from "../components/MyDecks";
import PinnedDecks from "../components/PinnedDecks";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Bookmarks from "@material-ui/icons/Bookmarks";

export class decks extends Component {
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

  render() {
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid item sm={10} lg={10} xl={10}>
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
                          My decks
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
                          Pinned decks
                        </div>
                      }
                      to="/create"
                    />
                  </Tabs>
                </div>
                <Divider></Divider>
                <br />

                {this.state.selectedTabIndex === 1 ? (
                  <PinnedDecks />
                ) : (
                  <MyDecks />
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

export default decks;
