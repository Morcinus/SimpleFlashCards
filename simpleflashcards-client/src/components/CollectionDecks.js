import React, { Component } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";

// Redux
import { connect } from "react-redux";

// Other
import { renderDecks } from "../util/functions";

export class CollectionDecks extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid container direction="row" justify="flex-start" alignItems="flex-start">
        {renderDecks(this.props.colUi.collection.deckArray)}
      </Grid>
    );
  }
}

CollectionDecks.propTypes = {
  colUi: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  colUi: state.colUi
});

export default connect(mapStateToProps)(CollectionDecks);
