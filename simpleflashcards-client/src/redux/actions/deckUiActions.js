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
import axios from "axios";

export const getUserDecks = () => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getUserDecks`)
    .then(res => {
      dispatch({ type: SET_USER_DECKS, payload: res.data });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const clearUserDecks = () => dispatch => {
  dispatch({ type: CLEAR_USER_DECKS });
};

export const getPinnedDecks = () => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getPinnedDecks`)
    .then(res => {
      dispatch({ type: SET_PINNED_DECKS, payload: res.data });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const clearPinnedDecks = () => dispatch => {
  dispatch({ type: CLEAR_PINNED_DECKS });
};

export const getDeck = deckId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getDeck/${deckId}`)
    .then(res => {
      dispatch({ type: SET_DECK, payload: res.data });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const clearDeck = () => dispatch => {
  dispatch({ type: CLEAR_DECK });
};

export const pinDeck = deckId => dispatch => {
  axios.post(`/pinDeck/${deckId}`).catch(err => {
    console.error("Error:", err.response.data.errorCode);
    dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
  });
};

export const unpinDeck = deckId => dispatch => {
  axios.post(`/unpinDeck/${deckId}`).catch(err => {
    console.error("Error:", err.response.data.errorCode);
    dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
  });
};
