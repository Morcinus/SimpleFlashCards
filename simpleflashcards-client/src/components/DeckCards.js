import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import LoopIcon from "@material-ui/icons/Loop";
import IconButton from "@material-ui/core/IconButton";

// Redux
import { connect } from "react-redux";

export class DeckCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardSides: [] // false = front; true = back
    };
    this.flipCard = this.flipCard.bind(this);
    this.flipAllCards = this.flipAllCards.bind(this);
  }

  // Flips card
  flipCard(index) {
    // Changing the array item
    // Source: https://stackoverflow.com/questions/29537299/react-how-to-update-state-item1-in-state-using-setstate
    let cardSides = [...this.state.cardSides];

    let cardSide = { ...cardSides[index] };

    cardSide = !this.state.cardSides[index];
    cardSides[index] = cardSide;

    this.setState({ cardSides });
  }

  // Flips all cards
  flipAllCards() {
    let cardSides = [...this.state.cardSides];
    let falseCount = 0;
    let trueCount = 0;

    // Counting the sides
    cardSides.forEach(cardSide => {
      if (cardSide) trueCount = trueCount + 1;
      else falseCount = falseCount + 1;
    });

    // Choosing the new side
    let newSide;
    if (falseCount === 0) {
      newSide = false;
    } else if (trueCount === 0) {
      newSide = true;
    } else if (falseCount < trueCount) {
      newSide = true;
    } else if (falseCount > trueCount) {
      newSide = false;
    }

    // Setting the new side for all cards
    for (let i = 0; i < cardSides.length; i++) {
      cardSides[i] = newSide;
    }
    this.setState({ cardSides });
  }

  componentDidMount() {
    // Fill cardSides with false values
    let arrayLength = this.props.deckUi.deck.cardArray.length;

    let cardSides = [];
    for (let i = 0; i < arrayLength; i++) {
      cardSides.push(false);
    }

    this.setState({ cardSides });
  }

  render() {
    return (
      <Fragment>
        <IconButton onClick={this.flipAllCards}>
          <LoopIcon />
        </IconButton>
        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
          <RenderCards cardArray={this.props.deckUi.deck.cardArray} cardSides={this.state.cardSides} flipCardFunction={this.flipCard} />
        </Grid>
      </Fragment>
    );
  }
}

function RenderCards({ cardArray, cardSides, flipCardFunction }) {
  let markup = [];

  const frontCardStyle = {
    width: "145px",
    height: "170px",
    marginRight: "20px",
    backgroundColor: "#fff0c7"
  };

  const backCardStyle = {
    width: "145px",
    height: "170px",
    marginRight: "20px",
    backgroundColor: "#ffe499"
  };

  for (let i = 0; i < cardArray.length; i++) {
    markup.push(
      <Grid item>
        <Card variant="outlined" style={cardSides[i] ? backCardStyle : frontCardStyle}>
          <CardActionArea style={{ width: "100%", height: "100%", textAlign: "center" }} onClick={() => flipCardFunction(i)}>
            <Typography variant="h6" style={{ color: "#37474f" }}>
              {cardSides[i] ? cardArray[i].body2 : cardArray[i].body1}
            </Typography>
          </CardActionArea>
        </Card>
      </Grid>
    );
  }

  return markup;
}

DeckCards.propTypes = {
  deckUi: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  deckUi: state.deckUi
});

export default connect(mapStateToProps)(DeckCards);
