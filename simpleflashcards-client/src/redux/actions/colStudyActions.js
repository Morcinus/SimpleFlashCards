import { SET_STUDY_COLLECTION, CLEAR_STUDY_COLLECTION, SET_STATUS_BUSY, SET_STATUS_ERROR, SET_STATUS_SUCCESS } from "../types";
import { openErrorAlert } from "./uiStatusActions";
import axios from "axios";

/**
 * @category ReduxActions
 * @module colStudyActions
 * @description Zde jsou funkce, které komunikují se serverem ohledně studování dané kolekce a vyvolávají změny v [colStudyReduceru]{@link module:colStudyReducer} a [uiStatusReduceru]{@link module:uiStatusReducer}.
 */

/**
 * @function getColLearnCards
 * @description Získá ze serveru data kolekce s kartami, které se uživatel ještě neučil. Data následně uloží do [colStudyReduceru]{@link module:colStudyReducer}.
 * @param {string} colId - ID dané kolekce.
 * @async
 */
export const getColLearnCards = colId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getColUnknownCards/${colId}`)
    .then(res => {
      dispatch({
        type: SET_STUDY_COLLECTION,
        payload: unpackCardsFromArrays(res.data.cardArray)
      });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      if (err.response) {
        console.error("Error:", err.response.data.errorCode);
        dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
      }
    });
};

/**
 * @function getColCardsToLearnAndReview
 * @description Získá ze serveru data kolekce s kartami, které se uživatel ještě neučil ale i s kartami, které by si měl uživatel zopakovat. Data následně uloží do [colStudyReduceru]{@link module:colStudyReducer}.
 * @param {string} colId - ID dané kolekce.
 * @async
 */
export const getColCardsToLearnAndReview = colId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getColCardsToLearnAndReview/${colId}`)
    .then(res => {
      dispatch({
        type: SET_STUDY_COLLECTION,
        payload: unpackCardsFromArrays(res.data.cardArray)
      });
      dispatch({ type: SET_STATUS_SUCCESS });
      console.log("SUCCESS");
    })
    .catch(err => {
      if (err.response) {
        console.error("Error:", err.response.data.errorCode);
        dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
      } else dispatch(openErrorAlert());
    });
};

/**
 * @function getColReviewCards
 * @description Získá ze serveru data kolekce s kartami, které by si měl uživatel zopakovat. Data následně uloží do [colStudyReduceru]{@link module:colStudyReducer}.
 * @param {string} colId - ID dané kolekce.
 * @async
 */
export const getColReviewCards = colId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getColCardsToReview/${colId}`)
    .then(res => {
      dispatch({
        type: SET_STUDY_COLLECTION,
        payload: unpackCardsFromArrays(res.data.cardArray)
      });
      dispatch({ type: SET_STATUS_SUCCESS });
      console.log("SUCCESS");
    })
    .catch(err => {
      if (err.response) {
        console.error("Error:", err.response.data.errorCode);
        dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
      } else dispatch(openErrorAlert());
    });
};

/**
 * @function pushCollectionProgress
 * @description Nahraje na server pole karet s informacemi o tom, jak se změnil pokrok uživatele u každé karty.
 * @param {Array<Object>} colProgressCards - Pole karet se zaznamenaným pokrokem uživatele u každé z nich.
 * @async
 */
export const pushCollectionProgress = colProgressCards => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });

  colProgressCards = groupIntoArrays(colProgressCards);
  let pushData = {
    cardArray: colProgressCards
  };

  axios
    .post(`/setColCardsProgress`, pushData)
    .then(() => {
      dispatch({ type: CLEAR_STUDY_COLLECTION });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      if (err.response) {
        console.error("Error:", err.response.data.errorCode);
        dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
      } else dispatch(openErrorAlert());
    });
};

/**
 * @function clearStudyCollection
 * @description Vymaže studovanou kolekci z [colStudyReduceru]{@link module:colStudyReducer}.
 */
export const clearStudyCollection = () => dispatch => {
  dispatch({ type: CLEAR_STUDY_COLLECTION });
};

/**
 * @function unpackCardsFromArrays
 * @description "Rozbalí" pole s balíčkama karet. Tzn. každé kartě přiřadí ID balíčku, ve kterém je zařazena a všechny karty uloží do jednoho pole.
 * @returns {Array<Object>} - Vrací pole s kartami, kde má každá karta přiřazený ID balíčku, ze kterého pochází.
 */
function unpackCardsFromArrays(deckArray) {
  let cardDeck = [];
  let deckIds = Object.keys(deckArray);

  for (let i = 0; i < deckIds.length; i++) {
    let deck = deckArray[deckIds[i]];
    deck.forEach(card => {
      card.deckId = deckIds[i];
      cardDeck.push(card);
    });
  }

  return cardDeck;
}

/**
 * @function groupIntoArrays
 * @description Seskupí karty na základě ID balíčku, ze kterého pochází. Tyto skupiny jsou pak pole, která se nazývají podle ID daných balíčků. Každé kartě je pak smazána hodnota deckId, protože je určena názvem pole, ve kterém se karta nachází.
 * @returns {Object} - Objekt, ve kterém jsou uloženy všechny karty, které jsou seskupené do polí podle ID balíčků, ze kterých pochází.
 */
function groupIntoArrays(cards) {
  let deckArrays = {};
  cards.forEach(card => {
    let deckId = card.deckId;

    // Check if the deckId is in decks already
    if (deckArrays.hasOwnProperty(deckId)) {
      // Push card to the existing deck array
      delete card.deckId;
      deckArrays[deckId].push(card);
    } else {
      // Create a new deck array
      delete card.deckId;
      deckArrays[deckId] = [card];
    }
  });
  return deckArrays;
}
