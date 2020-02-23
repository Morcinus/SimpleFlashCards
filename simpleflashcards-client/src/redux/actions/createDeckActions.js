import { UPDATE_DECK_DATA, DELETE_DECK_DATA, SET_STATUS_BUSY, SET_STATUS_ERROR, SET_STATUS_SUCCESS, CLEAR_STATUS } from "../types";
import axios from "axios";

export const saveDeckDraft = deckData => dispatch => {
  dispatch({ type: UPDATE_DECK_DATA, payload: deckData });
};

export const deleteDeckDraft = () => dispatch => {
  dispatch({ type: DELETE_DECK_DATA });
};

export const uploadDeck = deckData => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });

  // Validate deckData
  const errorCodes = validateUploadDeckData(deckData);
  if (errorCodes.length > 0) {
    errorCodes.forEach(errorCode => {
      console.error("Error:", errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: errorCode });
    });
  } else {
    // Push cards to export deck
    let exportDeckCards = [];
    deckData.deckCards.forEach(card => {
      let newCard = {
        body1: card.frontPage,
        body2: card.backPage
      };
      exportDeckCards.push(newCard);
    });

    // Create export deck data
    const exportDeckData = {
      deckName: deckData.deckName,
      deckCards: exportDeckCards,
      deckDescription: deckData.deckDescription,
      private: deckData.private
    };

    const imageFormData = deckData.imageFormData ? deckData.imageFormData : null;

    axios
      .post("/createDeck", exportDeckData)
      .then(res => {
        // Upload deck image
        if (imageFormData) {
          axios
            .post(`/uploadDeckImage/${res.data.deckId}`, imageFormData)
            .then(() => {
              dispatch(deleteDeckDraft());
              dispatch({ type: SET_STATUS_SUCCESS, payload: "createDeck/deck-created" });
            })
            .catch(err => {
              console.error("Error:", err.response.data.errorCode);
              dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
            });
        } else {
          dispatch({ type: SET_STATUS_SUCCESS, payload: "createDeck/deck-created" });
        }
      })
      .catch(err => {
        if (err.response.data.errorCodes) {
          err.response.data.errorCodes.forEach(errorCode => {
            console.error("Error:", errorCode);
            dispatch({ type: SET_STATUS_ERROR, payload: errorCode });
          });
        } else {
          console.error("Error:", err.response.data.errorCode);
          dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
        }
      });
  }
};

const validateUploadDeckData = deckData => {
  let errors = [];

  // DeckName validation
  if (deckData.deckName !== "") {
    let deckNameRegex = /^[a-zA-Z0-9]+$/;
    if (!deckData.deckName.match(deckNameRegex)) {
      errors.push("createDeck/empty-deck-name");
    }
  } else {
    errors.push("createDeck/empty-deck-name");
  }

  // DeckCards validation
  if (deckData.deckCards.length <= 0) {
    errors.push("createDeck/empty-deck");
  }

  return errors;
};
