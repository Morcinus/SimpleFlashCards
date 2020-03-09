import { UPDATE_DECK_DATA, DELETE_DECK_DATA, SET_STATUS_BUSY, SET_STATUS_ERROR, SET_STATUS_SUCCESS } from "../types";
import axios from "axios";
import { DECK_COL_NAME_REGEX } from "../../util/other";

/**
 * @category ReduxActions
 * @module createDeckActions
 * @description Zde jsou funkce, které komunikují se serverem ohledně vytváření balíčku a vyvolávají změny v [createDeckReduceru]{@link module:createDeckReducer} a [uiStatusReduceru]{@link module:uiStatusReducer}.
 */

/**
 * @function saveDeckDraft
 * @description Uloží do [createDeckReduceru]{@link module:createDeckReducer} návrh balíčku. Tato funkce je zavolána, pokud uživatel opustí stránku bez uložení balíčku na server.
 * @param {Object} deckData - Data balíčku.
 */
export const saveDeckDraft = deckData => dispatch => {
  dispatch({ type: UPDATE_DECK_DATA, payload: deckData });
};

/**
 * @function deleteDeckDraft
 * @description Vymaže návrh balíčku z [createDeckReduceru]{@link module:createDeckReducer}.
 */
export const deleteDeckDraft = () => dispatch => {
  dispatch({ type: DELETE_DECK_DATA });
};

/**
 * @function uploadDeck
 * @description Nahraje na server nově vytvořený balíček.
 * @param {Object} deckData - Data balíčku.
 * @async
 */
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
      errors.push("createDeck/invalid-deck-name");
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
