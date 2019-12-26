import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

// Redux
import { connect } from "react-redux";

// Other
import defaultDeckImageUrl from "../util/other";

export class CollectionDecks extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <RenderDecks deckArray={this.props.colUi.collection.deckArray} />
      </Grid>
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
            marginRight: "20px",
            backgroundColor: "#fff0c7"
          }}
        >
          <CardActionArea
            style={{ width: "100%", height: "100%", textAlign: "center" }}
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
      </Grid>
    );
  }

  return markup;
}

CollectionDecks.propTypes = {
  colUi: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  colUi: state.colUi
});

export default connect(mapStateToProps)(CollectionDecks);
