import { SET_EDIT_DECK_DATA, DELETE_EDIT_DECK_DATA, SET_STATUS_BUSY, SET_STATUS_ERROR, SET_STATUS_SUCCESS } from "../types";
import axios from "axios";
import { DECK_COL_NAME_REGEX } from "../../util/other";

/**
 * @category ReduxActions
 * @module editDeckActions
 * @description Zde jsou funkce, které komunikují se serverem ohledně upravování balíčku a vyvolávají změny v [editDeckReduceru]{@link module:editDeckReducer} a [uiStatusReduceru]{@link module:uiStatusReducer}.
 */

/**
 * @function deleteDeckDraft
 * @description Vymaže návrh balíčku z [editDeckReduceru]{@link module:editDeckReducer}.
 */
export const deleteDeckDraft = () => dispatch => {
  dispatch({ type: DELETE_EDIT_DECK_DATA });
};

/**
 * @function updateDeck
 * @description Nahraje na server novou verzi balíčku.
 * @param {Object} deckData - Data balíčku.
 * @param {string} deckId - ID upravovaného balíčku.
 * @async
 */
export const updateDeck = (deckData, deckId) => dispatch => {
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
        body2: card.backPage,
        cardId: card.cardId
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
      .post(`/updateDeck/${deckId}`, exportDeckData)
      .then(res => {
        // Upload deck image
        if (imageFormData) {
          axios
            .post(`/uploadDeckImage/${deckId}`, imageFormData)
            .then(() => {
              dispatch({ type: SET_STATUS_SUCCESS, payload: "updateDeck/deck-updated" });
            })
            .catch(err => {
              console.error("Error:", err.response.data.errorCode);
              dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
            });
        } else {
          dispatch({ type: SET_STATUS_SUCCESS, payload: "updateDeck/deck-updated" });
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

/**
 * @function getDeck
 * @description Získá ze serveru data o balíčku na základě jeho ID. Data pak uloží do [editDeckReduceru]{@link module:editDeckReducer}.
 * @param {string} deckId - data balíčku
 * @async
 */
export const getDeck = deckId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getDeck/${deckId}`)
    .then(res => {
      dispatch({ type: SET_EDIT_DECK_DATA, payload: res.data.deck });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

/**
 * @function validateUploadDeckData
 * @description Ověří, zda jsou data balíčku platná.
 * @param {Object} deckData - Data balíčku.
 * @returns {Array<String>} Vrací pole error kódů. Pokud jsou všechna data planá, vrací prázdné pole.
 */
const validateUploadDeckData = deckData => {
  let errors = [];

  // DeckName validation
  if (deckData.deckName !== "") {
    if (!deckData.deckName.match(DECK_COL_NAME_REGEX)) {
      errors.push("updateDeck/invalid-deck-name");
    }
  } else {
    errors.push("updateDeck/empty-deck-name");
  }

  // DeckCards validation
  if (deckData.deckCards.length <= 0) {
    errors.push("updateDeck/empty-deck");
  }

  return errors;
};

/**
 * @function deleteDeck
 * @description Pošle na server požadavek, aby byl daný balíček smazán.
 * @param {string} deckId - ID balíčku.
 * @async
 */
export const deleteDeck = deckId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .post(`/deleteDeck/${deckId}`)
    .then(res => {
      dispatch({ type: DELETE_EDIT_DECK_DATA });
      dispatch(deleteDeckDraft());
      dispatch({ type: SET_STATUS_SUCCESS, payload: res.data.successCode });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};
