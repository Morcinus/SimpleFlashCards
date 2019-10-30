import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import Input from "@material-ui/core/Input";
import Box from "@material-ui/core/Box";
import BookmarkBorder from "@material-ui/icons/BookmarkBorder";
import Share from "@material-ui/icons/Share";

export class DeckInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
      anchorEl: null,
      copiedLink: false
    };
  }

  handleCopyClick = elementId => {
    // Zdroj: https://stackoverflow.com/questions/39501289/in-reactjs-how-to-copy-text-to-clipboard
    let textField = document.createElement("textarea");
    textField.innerText = `${window.location.href}`;
    let parentElement = document.getElementById(elementId);
    parentElement.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    parentElement.removeChild(textField);

    this.setState({
      copiedLink: true
    });
  };

  handlePopoverOpen = event => {
    this.setState({
      popoverOpen: true,
      anchorEl: event.currentTarget
    });
  };

  handlePopoverClose = () => {
    this.setState({
      popoverOpen: false
    });
  };

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

          <Button
            onClick={this.handlePopoverOpen}
            item
            variant="outlined"
            color="primary"
            size="large"
          >
            <Share /> <Typography> Share</Typography>
          </Button>
          <Popover
            open={this.state.popoverOpen}
            anchorEl={this.state.anchorEl}
            onClose={this.handlePopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
          >
            <Box style={{ margin: "20px" }} id="popover">
              <Typography style={{ fontWeight: "bold", color: "#37474f" }}>
                Share this deck
              </Typography>
              <Input
                defaultValue={`${window.location.href}`}
                readOnly={true}
                style={{ color: "#808080" }}
              />
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
              >
                <Box item flexGrow={1}>
                  <Typography style={{ color: "#37474f" }}>
                    {this.state.copiedLink ? "Copied!" : ""}
                  </Typography>
                </Box>
                <Button
                  item
                  color="secondary"
                  style={{ fontWeight: "bold" }}
                  onClick={() => this.handleCopyClick("popover")}
                >
                  Copy link
                </Button>
              </Grid>
            </Box>
          </Popover>
        </Grid>
      </Grid>
    );
  }
}

export default DeckInfo;
