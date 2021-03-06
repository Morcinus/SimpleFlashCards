import {
  SET_USER_DECKS,
  SET_PINNED_DECKS,
  CLEAR_PINNED_DECKS,
  CLEAR_USER_DECKS,
  SET_DECK,
  CLEAR_DECK,
  SET_STATUS_BUSY,
  SET_STATUS_ERROR,
  SET_STATUS_SUCCESS
} from "../types";
import { openErrorAlert } from "./uiStatusActions";
import axios from "axios";

/**
 * @category ReduxActions
 * @module deckUiActions
 * @description Zde jsou funkce, které komunikují se serverem ohledně balíčků a vyvolávají změny v [deckUiReduceru]{@link module:deckUiReducer} a [uiStatusReduceru]{@link module:uiStatusReducer}.
 */

/**
 * @function getUserDecks
 * @description Získá ze serveru seznam balíčků vytvořených uživatelem a uloží ho do [deckUiReduceru]{@link module:deckUiReducer}.
 * @async
 */
export const getUserDecks = () => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getUserDecks`)
    .then(res => {
      dispatch({ type: SET_USER_DECKS, payload: res.data });
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
 * @function clearUserDecks
 * @description Vymaže seznam balíčků vytvořených uživatelem z [deckUiReduceru]{@link module:deckUiReducer}.
 */
export const clearUserDecks = () => dispatch => {
  dispatch({ type: CLEAR_USER_DECKS });
};

/**
 * @function getPinnedDecks
 * @description Získá ze serveru seznam balíčků připnutých uživatelem a uloží ho do [deckUiReduceru]{@link module:deckUiReducer}.
 * @async
 */
export const getPinnedDecks = () => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getPinnedDecks`)
    .then(res => {
      dispatch({ type: SET_PINNED_DECKS, payload: res.data });
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
 * @function clearPinnedDecks
 * @description Vymaže seznam balíčků připnutých uživatelem z [deckUiReduceru]{@link module:deckUiReducer}.
 */
export const clearPinnedDecks = () => dispatch => {
  dispatch({ type: CLEAR_PINNED_DECKS });
};

/**
 * @function getDeck
 * @description Získá ze serveru prodrobná data o daném balíčku a uloží je do [deckUiReduceru]{@link module:deckUiReducer}.
 * @param {string} deckId - ID balíčku, o kterém se mají získat data.
 * @async
 */
export const getDeck = deckId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getDeck/${deckId}`)
    .then(res => {
      dispatch({ type: SET_DECK, payload: res.data });
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
 * @function clearDeck
 * @description Smaže data o daném balíčku z [deckUiReduceru]{@link module:deckUiReducer}.
 */
export const clearDeck = () => dispatch => {
  dispatch({ type: CLEAR_DECK });
};

/**
 * @function pinDeck
 * @description Pošle na server požadavek, aby byl připnut daný balíček.
 * @param {string} deckId - ID balíčku, který má být připnut.
 * @async
 */
export const pinDeck = deckId => dispatch => {
  axios.post(`/pinDeck/${deckId}`).catch(err => {
    if (err.response) {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    } else dispatch(openErrorAlert());
  });
};

/**
 * @function unpinDeck
 * @description Pošle na server požadavek, aby byl odepnut daný balíček.
 * @param {string} deckId - ID balíčku, který má být odepnut.
 * @async
 */
export const unpinDeck = deckId => dispatch => {
  axios.post(`/unpinDeck/${deckId}`).catch(err => {
    if (err.response) {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    } else dispatch(openErrorAlert());
  });
};
