import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import LinearProgress from "@material-ui/core/LinearProgress";

// Other
import defaultDeckImageUrl from "../util/other";

// Redux
import { connect } from "react-redux";
import { getUserDecks, clearUserDecks } from "../redux/actions/deckUiActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

export class UserDecks extends Component {
  componentDidMount() {
    this.props.getUserDecks();
  }

  componentWillUnmount() {
    this.props.clearStatus();
    this.props.clearUserDecks();
  }

  render() {
    const {
      uiStatus: { status, errorCodes }
    } = this.props;
    return (
      <div>
        {status == "BUSY" && (
          <React.Fragment>
            <LinearProgress color="secondary" />
            <Typography variant="h5" color="secondary" align="right">
              Loading...
            </Typography>
          </React.Fragment>
        )}
        {status == "ERROR" && errorCodes.includes("deck/no-deck-found") && (
          <Typography variant="h6" color="error" align="center">
            You don't have any decks!
          </Typography>
        )}
        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
          {status == "SUCCESS" && <RenderDecks deckArray={this.props.deckUi.userDecks} />}
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
          <CardActionArea style={{ width: "100%", height: "100%" }} component={Link} to={`/deck/${deckArray[i].deckId}`}>
            <CardMedia style={{ width: "100%", height: "100%" }} image={deckArray[i].deckImage ? deckArray[i].deckImage : defaultDeckImageUrl}></CardMedia>
          </CardActionArea>
        </Card>
        <Typography>{deckArray[i].deckName}</Typography>
      </Grid>
    );
  }

  return markup;
}

UserDecks.propTypes = {
  getUserDecks: PropTypes.func.isRequired,
  clearUserDecks: PropTypes.func.isRequired,
  deckUi: PropTypes.object.isRequired,
  clearStatus: PropTypes.func.isRequired,
  uiStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  deckUi: state.deckUi,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  getUserDecks,
  clearUserDecks,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(UserDecks);
