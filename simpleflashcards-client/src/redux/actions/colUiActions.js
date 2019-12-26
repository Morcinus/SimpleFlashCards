import {
  SET_USER_COLLECTIONS,
  SET_PINNED_COLLECTIONS,
  CLEAR_PINNED_COLLECTIONS,
  CLEAR_USER_COLLECTIONS,
  SET_COLLECTION,
  CLEAR_COLLECTION,
  LOADING_COLLECTION_UI
} from "../types";
import axios from "axios";

// Neni SET_ERRORS ?
export const getUserCollections = () => dispatch => {
  dispatch({ type: LOADING_COLLECTION_UI });
  axios
    .get(`/getUserCollections`)
    .then(res => {
      console.log(res.data);
      dispatch({ type: SET_USER_COLLECTIONS, payload: res.data });
    })
    .catch(err => console.log(err));
};

// export const getPinnedDecks = () => dispatch => {
//   dispatch({ type: LOADING_DECK_UI });
//   axios
//     .get(`/getPinnedDecks`)
//     .then(res => {
//       console.log(res.data);
//       dispatch({ type: SET_PINNED_DECKS, payload: res.data });
//     })
//     .catch(err => console.log(err));
// };

// export const getDeck = deckId => dispatch => {
//   dispatch({ type: LOADING_DECK_UI });
//   axios
//     .get(`/getDeck/${deckId}`)
//     .then(res => {
//       console.log(res.data);
//       dispatch({ type: SET_DECK, payload: res.data });
//     })
//     .catch(err => console.log(err));
// };

// export const clearPinnedDecks = () => dispatch => {
//   dispatch({ type: CLEAR_PINNED_DECKS });
// };

export const clearUserCollections = () => dispatch => {
  dispatch({ type: CLEAR_USER_COLLECTIONS });
};

// export const clearDeck = () => dispatch => {
//   dispatch({ type: CLEAR_DECK });
// };

// export const pinDeck = deckId => dispatch => {
//   console.log("Pinning deck");
//   axios.post(`/pinDeck/${deckId}`).catch(err => {
//     console.log(err.response.data);
//   });
// };

// export const unpinDeck = deckId => dispatch => {
//   console.log("Unpinning deck");
//   axios.post(`/unpinDeck/${deckId}`).catch(err => {
//     console.log(err.response.data);
//   });
// };
