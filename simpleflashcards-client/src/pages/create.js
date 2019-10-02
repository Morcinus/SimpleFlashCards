import React, { Component } from "react";
import PropTypes from "prop-types";
import DeckTable from "../components/DeckTable";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {
  Divider,
  Card,
  CardContent,
  TextField,
  Box,
  Button
} from "@material-ui/core";
import Photo from "@material-ui/icons/Photo";

// Redux
import { connect } from "react-redux";
import { saveDeckDraft } from "../redux/actions/createDeckActions";

export class create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deckName: "",
      deckDescription: "",
      deckImage: null,
      deckCards: [],
      imageUrl: null
    };
    this.updateDeckCards = this.updateDeckCards.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  componentDidMount() {
    this.setState({
      deckName: this.props.deckCreation.deckName,
      deckDescription: this.props.deckCreation.deckDescription,
      deckImage: this.props.deckCreation.deckImage,
      deckCards: this.props.deckCreation.deckCards,
      imageUrl: this.props.deckCreation.imageUrl
    });
  }

  componentWillUnmount() {
    let deckData = {
      deckName: this.state.deckName,
      deckDescription: this.state.deckDescription,
      deckImage: this.state.deckImage,
      deckCards: this.state.deckCards,
      imageUrl: this.state.imageUrl
    };
    this.props.saveDeckDraft(deckData);
  }

  updateDeckCards(cards) {
    this.setState({
      deckCards: cards
    });
  }

  handleImageChange = event => {
    this.setState({
      deckImage: event.target.files[0],
      imageUrl: URL.createObjectURL(event.target.files[0])
    });
  };

  handleImageUpload() {
    document.getElementById("imageInput").click();
  }

  render() {
    return (
      <div className="rootContainer">
        <Grid container justify="center">
          <Grid item sm={10} lg={10} xl={10}>
            <Paper>
              <div style={{ padding: "25px 50px" }}>
                <Typography variant="h4">Create new deck</Typography>
                <Divider></Divider>
                <br />
                <Grid container>
                  <Grid item sm={10} lg={10} xl={10} container direction="row">
                    <Grid>
                      {/* <Card
                        style={{
                          width: "110px",
                          height: "130px",
                          marginRight: "20px"
                        }}
                      >
                        <CardContent>
                          <Typography
                            style={{ textAlign: "center" }}
                            variant="body2"
                          >
                            <Photo></Photo>
                            CHOOSE COVER (OPTIONAL)
                          </Typography>
                        </CardContent>
                      </Card> */}

                      {this.state.deckImage ? (
                        <Button
                          style={{
                            width: "110px",
                            height: "130px",
                            marginRight: "20px",
                            backgroundImage: `url(${this.state.imageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                          }}
                          onClick={this.handleImageUpload}
                        >
                          <input
                            type="file"
                            id="imageInput"
                            hidden="hidden"
                            onChange={this.handleImageChange}
                          />
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          style={{
                            width: "110px",
                            height: "130px",
                            marginRight: "20px"
                          }}
                          onClick={this.handleImageUpload}
                        >
                          <input
                            type="file"
                            id="imageInput"
                            hidden="hidden"
                            onChange={this.handleImageChange}
                          />
                          <Typography
                            style={{ textAlign: "center" }}
                            variant="body2"
                          >
                            <Photo></Photo>
                            CHOOSE COVER (OPTIONAL)
                          </Typography>
                        </Button>
                      )}
                    </Grid>
                    <Grid>
                      <Box style={{ marginBottom: "20px" }}>
                        <TextField
                          variant="outlined"
                          label="Enter Title"
                          name="deckName"
                          value={this.state.deckName}
                          onChange={this.handleChange}
                          InputLabelProps={{
                            shrink: true
                          }}
                        ></TextField>
                      </Box>
                      <Box>
                        <TextField
                          variant="outlined"
                          label="Enter Description (optional)"
                          name="deckDescription"
                          value={this.state.deckDescription}
                          onChange={this.handleChange}
                          InputLabelProps={{
                            shrink: true
                          }}
                        ></TextField>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    sm={2}
                    lg={2}
                    xl={2}
                    container
                    justify="flex-end"
                    alignItems="flex-start"
                  >
                    <Button size="large" color="secondary" variant="contained">
                      Create
                    </Button>
                  </Grid>
                </Grid>
                <br />
                <DeckTable
                  data={this.state.deckCards}
                  updateDeckCards={this.updateDeckCards}
                ></DeckTable>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

create.propTypes = {
  saveDeckDraft: PropTypes.func.isRequired,
  deckCreation: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  deckCreation: state.deckCreation
});

const mapActionsToProps = {
  saveDeckDraft
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(create);
