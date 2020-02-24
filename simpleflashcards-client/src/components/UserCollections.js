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
import { collectionDefaultImgUrl } from "../util/other";

// Redux
import { connect } from "react-redux";
import { getUserCollections, clearUserCollections } from "../redux/actions/colUiActions";
import { clearStatus } from "../redux/actions/uiStatusActions";

export class UserCollections extends Component {
  componentDidMount() {
    this.props.getUserCollections();
  }

  componentWillUnmount() {
    this.props.clearStatus();
    this.props.clearUserCollections();
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
        {status == "ERROR" && errorCodes.includes("collection/no-collection-found") && (
          <Typography variant="h6" color="error" align="center">
            You don't have any collections!
          </Typography>
        )}
        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
          {status == "SUCCESS" && <RenderCollections collectionArray={this.props.colUi.userCollections} />}
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
          <CardActionArea style={{ width: "100%", height: "100%" }} component={Link} to={`/collection/${collectionArray[i].colId}`}>
            <CardMedia style={{ width: "100%", height: "100%" }} image={collectionDefaultImgUrl}></CardMedia>
          </CardActionArea>
        </Card>
        <Typography>{collectionArray[i].colName}</Typography>
      </Grid>
    );
  }

  return markup;
}

UserCollections.propTypes = {
  getUserCollections: PropTypes.func.isRequired,
  clearUserCollections: PropTypes.func.isRequired,
  colUi: PropTypes.object.isRequired,
  clearStatus: PropTypes.func.isRequired,
  uiStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  colUi: state.colUi,
  uiStatus: state.uiStatus
});

const mapActionsToProps = {
  getUserCollections,
  clearUserCollections,
  clearStatus
};

export default connect(mapStateToProps, mapActionsToProps)(UserCollections);
