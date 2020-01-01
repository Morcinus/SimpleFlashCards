import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Lock from "@material-ui/icons/Lock";
import Person from "@material-ui/icons/Person";
import Mail from "@material-ui/icons/Mail";
import Notes from "@material-ui/icons/Notes";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import LinearProgress from "@material-ui/core/LinearProgress";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";

// Other
import defaultDeckImageUrl from "../util/other";
import { collectionDefaultImgUrl } from "../util/other";

// Redux
import { connect } from "react-redux";
import {
  getUserDataByUsername,
  clearUserData
} from "../redux/actions/userActions";

export class userProfile extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      success: {},
      username: "",
      bio: ""
    };
  }

  componentDidMount() {
    if (this.props.location.state)
      if (this.props.location.state.isCurrentUserProfile === true) {
        // Remove isCurrentUserProfile from location state
        const state = { ...this.props.location.state };
        delete state.isCurrentUserProfile;
        this.props.history.replace({ ...this.props.location, state });
      } else this.props.getUserDataByUsername(this.props.match.params.username);
    else this.props.getUserDataByUsername(this.props.match.params.username);
  }

  render() {
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid item sm={8} lg={8} xl={8}>
            <Paper>
              <div style={{ padding: "25px 50px" }}>
                <Typography variant="h5">
                  {this.props.user.userProfile.username
                    ? this.props.user.userProfile.username
                    : "Loading..."}
                </Typography>
                <Typography variant="h6">
                  {this.props.user.userProfile.bio
                    ? this.props.user.userProfile.bio
                    : "Loading..."}
                </Typography>
                <Divider></Divider>

                <br />

                <Typography variant="h5">Decks created by this user</Typography>
                {this.props.user.userProfile.createdDecks ? (
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                  >
                    <RenderDecks
                      deckArray={this.props.user.userProfile.createdDecks}
                    />{" "}
                  </Grid>
                ) : (
                  "Loading..."
                )}
                <br />
                <Typography variant="h5">
                  Collections created by this user
                </Typography>
                {this.props.user.userProfile.createdCollections ? (
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                  >
                    <RenderCollections
                      collectionArray={
                        this.props.user.userProfile.createdCollections
                      }
                    />{" "}
                  </Grid>
                ) : (
                  "Loading..."
                )}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

function RenderDecks({ deckArray }) {
  let markup = [];

  for (let i = 0; i < deckArray.length; i++) {
    markup.push(
      <Grid item>
        <Card
          variant="outlined"
          style={{
            width: "145px",
            height: "170px",
            marginRight: "20px"
          }}
        >
          <CardActionArea
            style={{ width: "100%", height: "100%" }}
            component={Link}
            to={`/deck/${deckArray[i].deckId}`}
          >
            <CardMedia
              style={{ width: "100%", height: "100%" }}
              image={
                deckArray[i].deckImage
                  ? deckArray[i].deckImage
                  : defaultDeckImageUrl
              }
            ></CardMedia>
          </CardActionArea>
        </Card>
        <Typography>{deckArray[i].deckName}</Typography>
      </Grid>
    );
  }

  return markup;
}

function RenderCollections({ collectionArray }) {
  let markup = [];

  for (let i = 0; i < collectionArray.length; i++) {
    markup.push(
      <Grid item>
        <Card
          variant="outlined"
          style={{
            width: "145px",
            height: "170px",
            marginRight: "20px"
          }}
        >
          <CardActionArea
            style={{ width: "100%", height: "100%" }}
            component={Link}
            to={`/collection/${collectionArray[i].colId}`}
          >
            <CardMedia
              style={{ width: "100%", height: "100%" }}
              image={collectionDefaultImgUrl}
            ></CardMedia>
          </CardActionArea>
        </Card>
        <Typography>{collectionArray[i].colName}</Typography>
      </Grid>
    );
  }

  return markup;
}

userProfile.propTypes = {
  getUserDataByUsername: PropTypes.func.isRequired,
  clearUserData: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  getUserDataByUsername,
  clearUserData
};

export default connect(mapStateToProps, mapActionsToProps)(userProfile);
