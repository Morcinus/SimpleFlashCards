import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import defaultDeckImageUrl from "../util/other";

// Redux
import { connect } from "react-redux";
import {
  getPinnedDecks,
  clearPinnedDecks
} from "../redux/actions/deckUiActions";

export class PinnedDecks extends Component {
  componentDidMount() {
    this.props.getPinnedDecks();
  }

  componentWillUnmount() {
    this.props.clearPinnedDecks();
  }

  render() {
    return (
      <div>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          <RenderDecks deckArray={this.props.deckUi.pinnedDecks} />
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
          <CardActionArea style={{ width: "100%", height: "100%" }}>
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

PinnedDecks.propTypes = {
  getPinnedDecks: PropTypes.func.isRequired,
  clearPinnedDecks: PropTypes.func.isRequired,
  deckUi: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  deckUi: state.deckUi
});

const mapActionsToProps = {
  getPinnedDecks,
  clearPinnedDecks
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(PinnedDecks);
