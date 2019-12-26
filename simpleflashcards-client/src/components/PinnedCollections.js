import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { collectionDefaultImgUrl } from "../util/other";

// Redux
import { connect } from "react-redux";
import {
  getPinnedCollections,
  clearPinnedCollections
} from "../redux/actions/colUiActions";

export class PinnedCollections extends Component {
  componentDidMount() {
    this.props.getPinnedCollections();
  }

  componentWillUnmount() {
    this.props.clearPinnedCollections();
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
          <RenderCollections
            collectionArray={this.props.colUi.pinnedCollections}
          />
        </Grid>
      </div>
    );
  }
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

PinnedCollections.propTypes = {
  getPinnedCollections: PropTypes.func.isRequired,
  clearPinnedCollections: PropTypes.func.isRequired,
  colUi: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  colUi: state.colUi
});

const mapActionsToProps = {
  getPinnedCollections,
  clearPinnedCollections
};

export default connect(mapStateToProps, mapActionsToProps)(PinnedCollections);
