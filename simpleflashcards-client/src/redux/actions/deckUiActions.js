import {
  SET_USER_DECKS,
  SET_PINNED_DECKS,
  CLEAR_PINNED_DECKS,
  CLEAR_USER_DECKS,
  SET_DECK,
  CLEAR_DECK,
  LOADING_DECK_UI
} from "../types";
import axios from "axios";

// Neni SET_ERRORS ?
export const getUserDecks = () => dispatch => {
  dispatch({ type: LOADING_DECK_UI });
  axios
    .get(`/getUserDecks`)
    .then(res => {
      console.log(res.data);
      dispatch({ type: SET_USER_DECKS, payload: res.data });
    })
    .catch(err => console.log(err));
};

export const getPinnedDecks = () => dispatch => {
  dispatch({ type: LOADING_DECK_UI });
  axios
    .get(`/getPinnedDecks`)
    .then(res => {
      console.log(res.data);
      dispatch({ type: SET_PINNED_DECKS, payload: res.data });
    })
    .catch(err => console.log(err));
};

export const getDeck = deckId => dispatch => {
  dispatch({ type: LOADING_DECK_UI });
  axios
    .get(`/getDeck/${deckId}`)
    .then(res => {
      console.log(res.data);
      dispatch({ type: SET_DECK, payload: res.data });
    })
    .catch(err => console.log(err));
};

export const clearPinnedDecks = () => dispatch => {
  dispatch({ type: CLEAR_PINNED_DECKS });
};

export const clearUserDecks = () => dispatch => {
  dispatch({ type: CLEAR_USER_DECKS });
};

export const clearDeck = () => dispatch => {
  dispatch({ type: CLEAR_DECK });
};
