import { SET_EDIT_DECK_DATA, DELETE_EDIT_DECK_DATA, SET_ERRORS, CLEAR_ERRORS } from "../types";
import axios from "axios";

export const saveDeckDraft = deckData => dispatch => {
  dispatch({ type: SET_EDIT_DECK_DATA, payload: deckData });
};

export const uploadDeck = (deckData, deckId) => dispatch => {
  const errors = validateUploadDeckData(deckData);
  if (Object.keys(errors).length !== 0) {
    dispatch({ type: SET_ERRORS, payload: errors });
    return true;
  } else {
    let exportDeckCards = [];
    deckData.deckCards.forEach(card => {
      let newCard = {
        body1: card.frontPage,
        body2: card.backPage,
        cardId: card.cardId
      };
      exportDeckCards.push(newCard);
    });
    // Osetrit jestli neni prazdny
    const exportDeckData = {
      deckName: deckData.deckName,
      deckCards: exportDeckCards,
      deckDescription: deckData.deckDescription,
      private: deckData.private
    };
    const imageFormData = deckData.imageFormData;
    console.log(exportDeckData);
    axios
      .post(`/updateDeck/${deckId}`, exportDeckData)
      .then(res => {
        console.log("Uploading image: ");
        console.log(res);
        // Upload deck image
        if (imageFormData) {
          console.log("Uploading image");
          axios.post(`/uploadDeckImage/${deckId}`, imageFormData).catch(err => {
            if (err.response) console.log(err.response.data);
          });
        }
      })
      .catch(err => {
        if (err.response) console.log(err.response.data);
      });
    dispatch({ type: CLEAR_ERRORS });
    return false;
  }
};

export const getDeck = deckId => dispatch => {
  axios
    .get(`/getDeck/${deckId}`)
    .then(res => {
      console.log(res.data);
      dispatch({ type: SET_EDIT_DECK_DATA, payload: res.data.deck });
    })
    .catch(err => console.log(err));
};

const validateUploadDeckData = deckData => {
  let errors = {};

  // Deck Name
  if (deckData.deckName === "") {
    errors.deckNameError = "Deck name must not be empty!";
  }

  // Deck Cards
  if (deckData.deckCards.length <= 0) {
    errors.deckCardsError = "There must be at least one card!";
  }

  return errors;
};

export const deleteDeck = deckId => dispatch => {
  axios
    .post(`/deleteDeck/${deckId}`)
    .then(() => {
      console.log("Deck Deleted!");
      dispatch({ type: DELETE_EDIT_DECK_DATA });
    })
    .catch(err => {
      if (err.response) console.log(err.response.data);
    });
};

export const deleteDeckDraft = () => dispatch => {
  dispatch({ type: DELETE_EDIT_DECK_DATA });
};
