import { SET_STUDY_DECK, CLEAR_STUDY_DECK, SET_STATUS_BUSY, SET_STATUS_ERROR, SET_STATUS_SUCCESS } from "../types";
import { openErrorAlert } from "./uiStatusActions";
import axios from "axios";

/**
 * @category ReduxActions
 * @module deckStudyActions
 * @description Zde jsou funkce, které komunikují se serverem ohledně studování daného balíčku a vyvolávají změny v [deckStudyReduceru]{@link module:deckStudyReducer} a [uiStatusReduceru]{@link module:uiStatusReducer}.
 */

/**
 * @function getLearnDeck
 * @description Získá ze serveru data balíčku s kartami, které se uživatel ještě neučil. Data následně uloží do [deckStudyReduceru]{@link module:deckStudyReducer}.
 * @param {string} deckId - ID daného balíčku.
 * @async
 */
export const getLearnDeck = deckId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getDeckUnknownCards/${deckId}`)
    .then(res => {
      dispatch({ type: SET_STUDY_DECK, payload: res.data });
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
 * @function getLearnAndReviewDeck
 * @description Získá ze serveru data balíčku s kartami, které se uživatel ještě neučil ale i s kartami, které by si měl uživatel zopakovat. Data následně uloží do [deckStudyReduceru]{@link module:deckStudyReducer}.
 * @param {string} deckId - ID daného balíčku.
 * @async
 */
export const getLearnAndReviewDeck = deckId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getCardsToLearnAndReview/${deckId}`)
    .then(res => {
      dispatch({ type: SET_STATUS_SUCCESS });
      dispatch({ type: SET_STUDY_DECK, payload: res.data });
    })
    .catch(err => {
      if (err.response) {
        console.error("Error:", err.response.data.errorCode);
        dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
      } else dispatch(openErrorAlert());
    });
};

/**
 * @function getReviewDeck
 * @description Získá ze serveru data balíčku s kartami, které by si měl uživatel zopakovat. Data následně uloží do [deckStudyReduceru]{@link module:deckStudyReducer}.
 * @param {string} deckId - ID daného balíčku.
 * @async
 */
export const getReviewDeck = deckId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getCardsToReview/${deckId}`)
    .then(res => {
      dispatch({ type: SET_STATUS_SUCCESS });
      dispatch({ type: SET_STUDY_DECK, payload: res.data });
    })
    .catch(err => {
      if (err.response) {
        console.error("Error:", err.response.data.errorCode);
        dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
      } else dispatch(openErrorAlert());
    });
};

/**
 * @function pushDeckProgress
 * @description Nahraje na server balíček s informacemi o tom, jak se změnil pokrok uživatele u každé karty.
 * @param {string} deckId - ID daného balíčku.
 * @param {Array<Object>} progressDeck - Balíček se zaznamenaným pokrokem uživatele
 * @async
 */
export const pushDeckProgress = (deckId, progressDeck) => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  let exportData = {
    cardArray: progressDeck
  };

  axios
    .post(`/setDeckCardsProgress/${deckId}`, exportData)
    .then(() => {
      dispatch({ type: CLEAR_STUDY_DECK });
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
 * @function clearStudyDeck
 * @description Vymaže studovaný balíček z [deckStudyReduceru]{@link module:deckStudyReducer}.
 */
export const clearStudyDeck = () => dispatch => {
  dispatch({ type: CLEAR_STUDY_DECK });
};
