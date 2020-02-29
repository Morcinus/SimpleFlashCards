import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// Material UI
import Grid from "@material-ui/core/Grid";
import LoopIcon from "@material-ui/icons/Loop";
import IconButton from "@material-ui/core/IconButton";

// Redux
import { connect } from "react-redux";

// Other
import { renderFlashCards } from "../util/functions";

/**
 * @class DeckCards
 * @extends Component
 * @category Components
 * @classdesc Tento komponent zobrazuje všechny karty daného balíčku.
 * @property {Object} state - Vnitřní state komponentu
 * @property {Array<boolean>} state.cardSides - Určuje, jak jsou otočené jednotlivé kartičky na této stránce. Pro hodnotu false uživatel vidí přední stranu, pro hodnotu true vidí zadní.
 *
 * @requires functions~renderFlashCards
 * @requires {@link module:store~reducers module:store~reducers.deckUi}
 */
export class DeckCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardSides: [] // false = front; true = back
    };
    this.flipCard = this.flipCard.bind(this);
    this.flipAllCards = this.flipAllCards.bind(this);
  }

  /**
   * @function flipCard
   * @memberOf DeckCards
   * @description Otočí kartu na druhou stranu tím, že přepíše hodnotu v cardSides poli v state tohoto komponentu.
   * @param {number} index - určuje číslo karty, která má být otočena.
   */
  flipCard(index) {
    // Zdroj: https://stackoverflow.com/questions/29537299/react-how-to-update-state-item1-in-state-using-setstate
    let cardSides = [...this.state.cardSides];

    let cardSide = { ...cardSides[index] };

    cardSide = !this.state.cardSides[index];
    cardSides[index] = cardSide;

    this.setState({ cardSides });
  }

  /**
   * @function flipAllCards
   * @memberOf DeckCards
   * @description Otočí všechny karty na stejnou stranu podle toho, na jakou stranu je otočena většina kartiček.
   */
  flipAllCards() {
    let cardSides = [...this.state.cardSides];
    let falseCount = 0;
    let trueCount = 0;

    // Počítání stran
    cardSides.forEach(cardSide => {
      if (cardSide) trueCount = trueCount + 1;
      else falseCount = falseCount + 1;
    });

    // Vybrání nové strany
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

    // Nastavení nové strany pro všechny kartičky
    for (let i = 0; i < cardSides.length; i++) {
      cardSides[i] = newSide;
    }
    this.setState({ cardSides });
  }

  /**
   * @function componentDidMount
   * @memberOf DeckCards
   * @description Pro každou kartu v balíčku nastaví její hodnotu otočení na false (tzn. na její přední stranu).
   */
  componentDidMount() {
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
        <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={2}>
          {renderFlashCards(this.props.deckUi.deck.cardArray, this.state.cardSides, this.flipCard)}
        </Grid>
      </Fragment>
    );
  }
}

DeckCards.propTypes = {
  deckUi: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  deckUi: state.deckUi
});

export default connect(mapStateToProps)(DeckCards);
