import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Tab from "@material-ui/core/Tab";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import BookmarkBorder from "@material-ui/icons/BookmarkBorder";
import Share from "@material-ui/icons/Share";

export class DeckInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid container direction="column">
        <Card
          variant="outlined"
          style={{
            width: "174px",
            height: "204px"
          }}
        >
          <CardMedia
            style={{ width: "100%", height: "100%" }}
            image="https://firebasestorage.googleapis.com/v0/b/simpleflashcards-4aea0.appspot.com/o/deckDefaultImg.png?alt=media"
          ></CardMedia>
        </Card>
        <br />
        <Typography variant="h5">
          {this.props.deck ? `${this.props.deck.deckName}` : "Loading..."}
        </Typography>

        <Typography>
          {this.props.deck
            ? this.props.deck.deckDescription
              ? `${this.props.deck.deckDescription}`
              : ""
            : "Loading..."}
        </Typography>
        <br />
        <Typography>
          Created by:{" "}
          {this.props.deck ? `${this.props.deck.creatorName}` : "Loading..."}
        </Typography>
        <br />
        <Divider></Divider>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          style={{ marginTop: "20px" }}
        >
          <Button
            item
            variant="outlined"
            color="primary"
            style={{ marginRight: "20px" }}
            size="large"
          >
            <BookmarkBorder /> <Typography> Pin</Typography>
          </Button>

          <Button item variant="outlined" color="primary" size="large">
            <Share /> <Typography> Share</Typography>
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default DeckInfo;
