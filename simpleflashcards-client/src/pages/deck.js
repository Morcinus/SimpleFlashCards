import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import BookmarksIcon from "@material-ui/icons/Bookmarks";
import LinearProgress from "@material-ui/core/LinearProgress";
import withStyles from "@material-ui/core/styles/withStyles";

// Components
import DeckInfo from "../components/DeckInfo";
import DeckCards from "../components/DeckCards";
import CollectionDialog from "../components/CollectionDialog";
import { deckLearnButtons } from "../util/functions";

// Redux
import { connect } from "react-redux";
import { getDeck, clearDeck } from "../redux/actions/deckUiActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

/**
 * @function styles
 * @memberof deck
 * @description Určuje CSS pro daný komponent.
 * @param {Object} theme - Theme (CSS) celé aplikace.
 */
const styles = theme => ({
  grid: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center"
    }
  },
  learnButtons: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column"
    }
  }
});

/**
 * @class deck
 * @extends Component
 * @category Pages
 * @classdesc Vytvoří stránku daného balíčku. Uživatel zde vidí všechny podrobné informace o balíčku,
 * může balíček sdílet, prohlédnout si jeho obsah nebo přejít do módu učení. Pokud je uživatel tvůrcem tohoto balíčku,
 * může také začít balíček upravovat.
 * @property {Object} state - Vnitřní state komponentu.
 * @property {number} state.selectedTabIndex - Index pro Tabs komponent na této stránce.
 *
 * @requires deckUiActions~getDeck
 * @requires deckUiActions~clearDeck
 * @requires functions~deckLearnButtons
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 */

export class deck extends Component {
  constructor() {
    super();
    this.state = {
      selectedTabIndex: 0
    };
  }

  /**
   * @function handleTabChange
   * @memberOf deck
   * @description Přepisuje [selectedTabIndex]{@link deck} v state tohoto komponentu při přepnutí v Tabs navigation baru.
   * @param {number} newValue - Nová hodnota pro [selectedTabIndex]{@link deck}.
   */
  handleTabChange = (_, newValue) => {
    this.setState({
      selectedTabIndex: newValue
    });
  };

  componentDidMount() {
    this.props.getDeck(this.props.match.params.deckId);
  }

  /**
   * @function componentWillUnmount
   * @memberOf deck
   * @description Vymaže status aplikace a informace o daném balíčku z reduceru.
   */
  componentWillUnmount() {
    this.props.clearStatus();
    this.props.clearDeck();
  }

  render() {
    const {
      classes,
      uiStatus: { status, errorCodes }
    } = this.props;
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid className={classes.grid} item sm={12} md={12} lg={10} xl={8} container spacing={3}>
            <Grid item xs={12} sm={10} md={3} lg={3} xl={3}>
              <DeckInfo deckId={this.props.match.params.deckId}></DeckInfo>
            </Grid>
            <Grid item xs={12} sm={10} md={9} lg={9} xl={9}>
              <Paper>
                <div style={{ padding: "25px 50px" }}>
                  <div>
                    <Tabs value={this.state.selectedTabIndex} onChange={this.handleTabChange}>
                      <Tab
                        label={
                          <div>
                            <LibraryBooksIcon
                              style={{
                                display: "inline-block",
                                marginBottom: "-5px",
                                marginRight: 5
                              }}
                            />
                            Learn
                          </div>
                        }
                        to="/home"
                      />
                      <Tab
                        label={
                          <div>
                            <BookmarksIcon
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

                  {status == "BUSY" && (
                    <React.Fragment>
                      <LinearProgress color="secondary" />
                      <Typography variant="h5" color="secondary" align="right">
                        Loading...
                      </Typography>
                    </React.Fragment>
                  )}
                  {status == "ERROR" && errorCodes.includes("deck/deck-not-found") ? (
                    <Typography variant="h6" color="error" align="center">
                      Error 404: Deck not found!
                    </Typography>
                  ) : (
                    errorCodes.includes("deck/access-denied") && (
                      <Typography variant="h6" color="error" align="center">
                        This deck is private! You don't have permission to view this deck!
                      </Typography>
                    )
                  )}
                  {status == "SUCCESS" &&
                    (this.state.selectedTabIndex === 1 ? (
                      <DeckCards />
                    ) : (
                      <Grid className={classes.learnButtons} container direction="row" justify="space-evenly" alignItems="center" spacing={2}>
                        {deckLearnButtons(this.props.match.params.deckId)}
                      </Grid>
                    ))}
                  <br />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <CollectionDialog deckId={this.props.match.params.deckId} />
      </div>
    );
  }
}

deck.propTypes = {
  getDeck: PropTypes.func.isRequired,
  clearDeck: PropTypes.func.isRequired,
  deckUi: PropTypes.object.isRequired,
  clearStatus: PropTypes.func.isRequired,
  uiStatus: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  deckUi: state.deckUi,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  getDeck,
  clearDeck,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(deck));
