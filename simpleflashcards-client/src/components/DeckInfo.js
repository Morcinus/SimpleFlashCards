import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import Input from "@material-ui/core/Input";
import Box from "@material-ui/core/Box";
import MUILink from "@material-ui/core/Link";
import BookmarkBorder from "@material-ui/icons/BookmarkBorder";
import Bookmark from "@material-ui/icons/Bookmark";
import Share from "@material-ui/icons/Share";
import Edit from "@material-ui/icons/Edit";
import LibraryAdd from "@material-ui/icons/LibraryAdd";
import Lock from "@material-ui/icons/Lock";

// Other
import defaultDeckImageUrl from "../util/other";
import AddToCollection from "./CollectionDialog";

// Redux
import { connect } from "react-redux";
import { pinDeck, unpinDeck } from "../redux/actions/deckUiActions";
import { openCollectionDialog } from "../redux/actions/colUiActions";

export class DeckInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
      anchorEl: null,
      copiedLink: false,
      isPinned: null
    };
    this.handlePinButtonClick = this.handlePinButtonClick.bind(this);
    this.handleAddToCollection = this.handleAddToCollection.bind(this);
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

  handlePinButtonClick() {
    let prevIsPinned = this.state.isPinned;
    this.setState({
      isPinned: !prevIsPinned
    });
  }

  handleAddToCollection() {
    this.props.openCollectionDialog();
  }

  componentDidUpdate(prevProps) {
    if (this.props.deckUi.deck) {
      if (this.props.deckUi.deck !== prevProps.deckUi.deck) {
        this.setState({
          isPinned: this.props.deckUi.deck.isPinned
        });
      }
    }
  }

  componentWillUnmount() {
    if (this.props.deckUi.deck.isPinned !== this.state.isPinned) {
      if (this.state.isPinned) {
        this.props.pinDeck(this.props.deckId);
      } else {
        this.props.unpinDeck(this.props.deckId);
      }
    }
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
            image={this.props.deckUi.deck ? (this.props.deckUi.deck.deckImage ? this.props.deckUi.deck.deckImage : defaultDeckImageUrl) : defaultDeckImageUrl}
          ></CardMedia>
        </Card>
        <br />
        <Typography variant="h5">
          {this.props.deckUi.deck ? this.props.deckUi.deck.private ? <Lock></Lock> : "" : ""}
          {this.props.deckUi.deck ? `${this.props.deckUi.deck.deckName}` : "Loading..."}
        </Typography>

        <Typography>
          {this.props.deckUi.deck ? (this.props.deckUi.deck.deckDescription ? `${this.props.deckUi.deck.deckDescription}` : "") : "Loading..."}
        </Typography>
        <br />
        <Typography>
          Created by:{" "}
          {this.props.deckUi.deck ? (
            <MUILink to={`/user/${this.props.deckUi.deck.creatorName}`} component={Link}>
              {this.props.deckUi.deck.creatorName}
            </MUILink>
          ) : (
            "Loading..."
          )}
        </Typography>
        <br />
        <Divider></Divider>
        <Grid container direction="row" justify="center" alignItems="center" style={{ marginTop: "20px" }}>
          <Button
            item
            variant={this.state.isPinned !== null ? (this.state.isPinned ? "contained" : "outlined") : "text"}
            color="primary"
            style={{ marginRight: "20px" }}
            size="large"
            onClick={this.handlePinButtonClick}
          >
            {this.state.isPinned !== null ? (
              this.state.isPinned ? (
                <Fragment>
                  <Bookmark /> <Typography> Pinned</Typography>
                </Fragment>
              ) : (
                <Fragment>
                  <BookmarkBorder /> <Typography> Pin</Typography>
                </Fragment>
              )
            ) : (
              "Loading..."
            )}
          </Button>

          <Button onClick={this.handlePopoverOpen} item variant="outlined" color="primary" size="large">
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
              <Typography style={{ fontWeight: "bold", color: "#37474f" }}>Share this deck</Typography>
              <Input defaultValue={`${window.location.href}`} readOnly={true} style={{ color: "#808080" }} />
              <Grid container direction="row" justify="flex-start" alignItems="center">
                <Box item flexGrow={1}>
                  <Typography style={{ color: "#37474f" }}>{this.state.copiedLink ? "Copied!" : ""}</Typography>
                </Box>
                <Button item color="secondary" style={{ fontWeight: "bold" }} onClick={() => this.handleCopyClick("popover")}>
                  Copy link
                </Button>
              </Grid>
            </Box>
          </Popover>
        </Grid>
        <Grid container direction="row" justify="center" alignItems="center" style={{ marginTop: "20px" }}>
          {this.props.deckUi.deck ? (
            this.props.deckUi.deck.isCreator ? (
              <Button item variant="text" color="primary" component={Link} to={`/editDeck/${this.props.deckId}`} style={{ marginRight: "20px" }}>
                <Edit style={{ marginRight: "5px" }} />
                <Typography variant="body2">
                  Edit
                  <br /> Deck
                </Typography>
              </Button>
            ) : (
              ""
            )
          ) : (
            "Loading..."
          )}

          <Button item variant="text" color="primary" onClick={this.handleAddToCollection}>
            <LibraryAdd style={{ marginRight: "5px" }} />
            <Typography variant="body2">
              Add to
              <br /> Collection
            </Typography>
          </Button>
        </Grid>
      </Grid>
    );
  }
}

DeckInfo.propTypes = {
  pinDeck: PropTypes.func.isRequired,
  unpinDeck: PropTypes.func.isRequired,
  openCollectionDialog: PropTypes.func.isRequired,
  deckUi: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  deckUi: state.deckUi
});

const mapActionsToProps = {
  pinDeck,
  unpinDeck,
  openCollectionDialog
};

export default connect(mapStateToProps, mapActionsToProps)(DeckInfo);
