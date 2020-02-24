import React, { Component } from "react";
import { Link } from "react-router-dom";
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
import LinearProgress from "@material-ui/core/LinearProgress";

import CollectionInfo from "../components/CollectionInfo";
import CollectionDecks from "../components/CollectionDecks";

// Redux
import { connect } from "react-redux";
import { getCollection, clearCollection } from "../redux/actions/colUiActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

export class collection extends Component {
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
    this.props.getCollection(this.props.match.params.colId);
  }

  componentWillUnmount() {
    this.props.clearStatus();
    this.props.clearCollection();
  }

  render() {
    const {
      uiStatus: { status, errorCodes }
    } = this.props;
    return (
      <div className="rootContainer">
        <Grid container justify="center" spacing={3} style={{ marginLeft: "20px" }}>
          <Grid item sm={3} lg={3} xl={3}>
            <CollectionInfo colId={this.props.match.params.colId}></CollectionInfo>
          </Grid>
          <Grid item sm={9} lg={9} xl={9}>
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

                {status == "SUCCESS" && (this.state.selectedTabIndex === 1 ? <CollectionDecks /> : learnButtons(this.props.match.params.colId))}

                <br />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

function learnButtons(colId) {
  const cardActionStyle = {
    width: "100%",
    height: "100%",
    textAlign: "center"
  };
  const iconStyle = {
    fontSize: 75,
    color: "#37474f"
  };
  const textStyle = {
    fontWeight: "bold",
    color: "#37474f"
  };
  const smallCardStyle = {
    width: "175px",
    height: "175px",
    marginRight: "20px",
    backgroundColor: "#bff27e"
  };
  const largeCardStyle = {
    width: "200px",
    height: "200px",
    marginRight: "20px",
    backgroundColor: "#91cc47"
  };
  const linkStyle = {
    textDecoration: "none"
  };

  return (
    <Grid container direction="row" justify="space-evenly" alignItems="center">
      <Card variant="outlined" style={smallCardStyle}>
        <Link to={`/studyCollection/${colId}?lessonType=learn`} style={linkStyle}>
          <CardActionArea style={cardActionStyle}>
            <MenuBook style={iconStyle}></MenuBook>
            <Typography style={textStyle}>LEARN NEW</Typography>
          </CardActionArea>
        </Link>
      </Card>
      <Card variant="outlined" style={largeCardStyle}>
        <Link to={`/studyCollection/${colId}?lessonType=study`} style={linkStyle}>
          <CardActionArea style={cardActionStyle}>
            <MenuBook style={iconStyle}></MenuBook>
            <FitnessCenter style={iconStyle}></FitnessCenter>
            <Typography style={textStyle}>LEARN & REVIEW</Typography>
          </CardActionArea>
        </Link>
      </Card>
      <Card variant="outlined" style={smallCardStyle}>
        <Link to={`/studyCollection/${colId}?lessonType=review`} style={linkStyle}>
          <CardActionArea style={cardActionStyle}>
            <FitnessCenter style={iconStyle}></FitnessCenter>
            <Typography style={textStyle}>REVIEW OLD</Typography>
          </CardActionArea>
        </Link>
      </Card>
    </Grid>
  );
}

collection.propTypes = {
  getCollection: PropTypes.func.isRequired,
  clearCollection: PropTypes.func.isRequired,
  colUi: PropTypes.object.isRequired,
  clearStatus: PropTypes.func.isRequired,
  uiStatus: PropTypes.object.isRequired
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

export default connect(mapStateToProps, mapActionsToProps)(collection);
