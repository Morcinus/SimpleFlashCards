import React, { Component } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Bookmarks from "@material-ui/icons/Bookmarks";
import LinearProgress from "@material-ui/core/LinearProgress";
import withStyles from "@material-ui/core/styles/withStyles";

// Other
import { colLearnButtons } from "../util/functions";
import CollectionInfo from "../components/CollectionInfo";
import CollectionDecks from "../components/CollectionDecks";

// Redux
import { connect } from "react-redux";
import { getCollection, clearCollection } from "../redux/actions/colUiActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

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
 * @class collection
 * @extends Component
 * @category Pages
 * @classdesc Vytvoří stránku dané kolekce. Uživatel zde vidí všechny podrobné informace o kolekci,
 * může kolekci sdílet, prohlédnout si její obsah nebo přejít do módu učení. Pokud je uživatel tvůrcem této kolekce,
 * může také začít balíček upravovat.
 * @property {Object} state - Vnitřní state komponentu
 * @property {number} state.selectedTabIndex - Index pro Tabs komponent na této stránce
 *
 * @requires colUiActions~getCollection
 * @requires colUiActions~clearCollection
 * @requires functions~colLearnButtons
 * @requires uiStatusActions~clearStatus
 * @requires {@link module:store~reducers module:store~reducers.uiStatus}
 */
export class collection extends Component {
  constructor() {
    super();
    this.state = {
      selectedTabIndex: 0
    };
  }

  /**
   * @function handleTabChange
   * @memberOf collection
   * @description Přepisuje [selectedTabIndex]{@link collection} v state tohoto komponentu při přepnutí v Tabs navigation baru
   * @param {number} newValue - Nová hodnota pro [selectedTabIndex]{@link collection}
   */
  handleTabChange = (_, newValue) => {
    this.setState({
      selectedTabIndex: newValue
    });
  };

  componentDidMount() {
    this.props.getCollection(this.props.match.params.colId);
  }

  componentWillUnmount() {
    this.props.clearStatus();
    this.props.clearCollection();
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
              <CollectionInfo colId={this.props.match.params.colId}></CollectionInfo>
            </Grid>
            <Grid item xs={12} sm={10} md={9} lg={9} xl={9}>
              <Paper>
                <div style={{ padding: "25px 50px" }}>
                  <div>
                    <Tabs value={this.state.selectedTabIndex} onChange={this.handleTabChange}>
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
                            Decks
                          </div>
                        }
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
                  {status == "ERROR" && errorCodes.includes("collection/collection-not-found") && (
                    <Typography variant="h6" color="error" align="center">
                      Error 404: Collection not found!
                    </Typography>
                  )}

                  {status == "SUCCESS" &&
                    (this.state.selectedTabIndex === 1 ? (
                      <CollectionDecks />
                    ) : (
                      <Grid className={classes.learnButtons} container direction="row" justify="space-evenly" alignItems="center" spacing={2}>
                        {colLearnButtons(this.props.match.params.colId)}
                      </Grid>
                    ))}
                  <br />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

collection.propTypes = {
  getCollection: PropTypes.func.isRequired,
  clearCollection: PropTypes.func.isRequired,
  colUi: PropTypes.object.isRequired,
  clearStatus: PropTypes.func.isRequired,
  uiStatus: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  colUi: state.colUi,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  getCollection,
  clearCollection,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(collection));
