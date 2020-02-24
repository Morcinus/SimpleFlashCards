import React, { Component } from "react";

// Components
import UserDecks from "../components/UserDecks";
import PinnedDecks from "../components/PinnedDecks";
import UserCollections from "../components/UserCollections";
import PinnedCollections from "../components/PinnedCollections";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Bookmarks from "@material-ui/icons/Bookmarks";

export class home extends Component {
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
                  <Tabs value={this.state.selectedTabIndex} onChange={this.handleChange}>
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
                    />
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
                          My Collections
                        </div>
                      }
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
                          Pinned Collections
                        </div>
                      }
                    />
                  </Tabs>
                </div>
                <Divider></Divider>
                <br />

                {(() => {
                  switch (this.state.selectedTabIndex) {
                    case 1:
                      return <PinnedDecks />;
                    case 2:
                      return <UserCollections />;
                    case 3:
                      return <PinnedCollections />;
                    default:
                      return <UserDecks />;
                  }
                })()}

                <br />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default home;
