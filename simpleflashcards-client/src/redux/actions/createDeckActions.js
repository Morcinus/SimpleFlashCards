import {
  UPDATE_DECK_DATA,
  DELETE_DECK_DATA,
  SET_ERRORS,
  CLEAR_ERRORS
} from "../types";
import axios from "axios";

export const saveDeckDraft = deckData => dispatch => {
  dispatch({ type: UPDATE_DECK_DATA, payload: deckData });
};

export const uploadDeck = deckData => dispatch => {
  const errors = validateUploadDeckData(deckData);
  if (Object.keys(errors).length !== 0) {
    dispatch({ type: SET_ERRORS, payload: errors });
    return true;
  } else {
    let exportDeckCards = [];
    deckData.deckCards.forEach(card => {
      let newCard = {
        body1: card.frontPage,
        body2: card.backPage
      };
      exportDeckCards.push(newCard);
    });

    // Osetrit jestli neni prazdny
    const exportDeckData = {
      deckName: deckData.deckName,
      deckCards: exportDeckCards,
      deckDescription: deckData.deckDescription
    };

    console.log(exportDeckData);

    axios.post("/createDeck", exportDeckData).catch(err => {
      console.log(err.response.data);
    });

    dispatch({ type: CLEAR_ERRORS });
    return false;
  }
};

const validateUploadDeckData = deckData => {
  let errors = {};

  // Email
  if (deckData.deckName === "") {
    errors.deckNameError = "Deck name must not be empty!";
  }

  // Password
  if (deckData.deckCards.length <= 0) {
    errors.deckCardsError = "There must be at least one card!";
  }

  return errors;
};

export const deleteDeckDraft = () => dispatch => {
  dispatch({ type: DELETE_DECK_DATA });
};
