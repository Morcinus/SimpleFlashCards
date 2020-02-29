import React, { Component } from "react";
import PropTypes from "prop-types";

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
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  container: {
    [theme.breakpoints.up("md")]: {
      padding: "25px 50px"
    }
  }
});

/**
 * @class home
 * @extends Component
 * @category Pages
 * @classdesc Stránka, na které si uživatel může prohlédnout seznam vytvořených a připnutých balíčků a kolekcí.
 * @property {Object} state - Vnitřní state komponentu
 * @property {number} state.selectedTabIndex - index pro Tabs komponent na této stránce
 *
 */
export class home extends Component {
  constructor() {
    super();
    this.state = {
      selectedTabIndex: 0
    };
  }

  /**
   * @function handleTabChange
   * @memberOf home
   * @description Přepisuje [selectedTabIndex]{@link home} v state tohoto komponentu při přepnutí v Tabs navigation baru
   * @param {number} newValue - Nová hodnota pro [selectedTabIndex]{@link home}
   */
  handleTabChange = (_, newValue) => {
    this.setState({
      selectedTabIndex: newValue
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid item sm={12} lg={10} xl={10}>
            <Paper>
              <div className={classes.container}>
                <div>
                  <Tabs value={this.state.selectedTabIndex} onChange={this.handleTabChange} variant="scrollable" scrollButtons="auto">
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

UserDecks.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(home);
