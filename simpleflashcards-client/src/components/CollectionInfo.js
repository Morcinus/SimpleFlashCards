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
import Lock from "@material-ui/icons/Lock";
import CircularProgress from "@material-ui/core/CircularProgress";

// Other
import { collectionDefaultImgUrl } from "../util/other";

// Redux
import { connect } from "react-redux";
import { pinCollection, unpinCollection } from "../redux/actions/colUiActions";

export class CollectionInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
      anchorEl: null,
      copiedLink: false,
      isPinned: false
    };
    this.handlePinButtonClick = this.handlePinButtonClick.bind(this);
  }

  handleCopyClick = elementId => {
    // Copy collection link to clipboard
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

  componentDidUpdate(prevProps) {
    // Load isPinned from colUi
    if (this.props.colUi.collection) {
      if (this.props.colUi.collection !== prevProps.colUi.collection) {
        this.setState({
          isPinned: this.props.colUi.collection.isPinned
        });
      }
    }
  }

  componentWillUnmount() {
    // Pin/Unpin collection
    if (this.props.colUi.collection.isPinned !== this.state.isPinned) {
      if (this.state.isPinned) {
        this.props.pinCollection(this.props.colId);
      } else {
        this.props.unpinCollection(this.props.colId);
      }
    }
  }

  render() {
    const {
      uiStatus: { status }
    } = this.props;
    return (
      <Grid container direction="column">
        {status == "BUSY" && (
          <React.Fragment>
            <Card
              variant="outlined"
              style={{
                width: "174px",
                height: "204px",
                backgroundColor: "#d9d9d9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <CircularProgress />
            </Card>
          </React.Fragment>
        )}
        {status == "SUCCESS" && this.props.colUi.collection && (
          <React.Fragment>
            <Card
              variant="outlined"
              style={{
                width: "174px",
                height: "204px"
              }}
            >
              <CardMedia style={{ width: "100%", height: "100%" }} image={collectionDefaultImgUrl}></CardMedia>
            </Card>

            <br />

            <Typography variant="h5">
              {this.props.colUi.collection.private && <Lock></Lock>}
              {this.props.colUi.collection.colName}
            </Typography>
            <Typography>{this.props.colUi.collection.colDescription}</Typography>

            <br />

            <Typography>
              Created by:
              <MUILink to={`/user/${this.props.colUi.collection.creatorName}`} component={Link}>
                {this.props.colUi.collection.creatorName}
              </MUILink>
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
                {this.state.isPinned ? (
                  <Fragment>
                    <Bookmark /> <Typography> Pinned</Typography>
                  </Fragment>
                ) : (
                  <Fragment>
                    <BookmarkBorder /> <Typography> Pin</Typography>
                  </Fragment>
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
                  <Typography style={{ fontWeight: "bold", color: "#37474f" }}>Share this collection</Typography>
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
            <Grid container justify="center" style={{ marginTop: "20px" }}>
              {this.props.colUi.collection.isCreator && (
                <Button item variant="text" color="primary" size="large" component={Link} to={`/editCollection/${this.props.colId}`}>
                  <Edit /> <Typography> Edit Collection</Typography>
                </Button>
              )}
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    );
  }
}

CollectionInfo.propTypes = {
  pinCollection: PropTypes.func.isRequired,
  unpinCollection: PropTypes.func.isRequired,
  colUi: PropTypes.object.isRequired,
  uiStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  colUi: state.colUi,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  pinCollection,
  unpinCollection
};

export default connect(mapStateToProps, mapActionsToProps)(CollectionInfo);
