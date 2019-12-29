import {
  SET_USER_COLLECTIONS,
  SET_PINNED_COLLECTIONS,
  CLEAR_PINNED_COLLECTIONS,
  CLEAR_USER_COLLECTIONS,
  SET_COLLECTION,
  CLEAR_COLLECTION,
  LOADING_COLLECTION_UI,
  OPEN_COLLECTION_DIALOG,
  CLOSE_COLLECTION_DIALOG
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

export const getPinnedCollections = () => dispatch => {
  dispatch({ type: LOADING_COLLECTION_UI });
  axios
    .get(`/getPinnedCollections`)
    .then(res => {
      console.log(res.data);
      dispatch({ type: SET_PINNED_COLLECTIONS, payload: res.data });
    })
    .catch(err => console.log(err));
};

export const getCollection = colId => dispatch => {
  dispatch({ type: LOADING_COLLECTION_UI });
  axios
    .get(`/getCollection/${colId}`)
    .then(res => {
      console.log(res.data);
      dispatch({ type: SET_COLLECTION, payload: res.data });
    })
    .catch(err => console.log(err));
};

export const clearPinnedCollections = () => dispatch => {
  dispatch({ type: CLEAR_PINNED_COLLECTIONS });
};

export const clearUserCollections = () => dispatch => {
  dispatch({ type: CLEAR_USER_COLLECTIONS });
};

export const clearCollection = () => dispatch => {
  dispatch({ type: CLEAR_COLLECTION });
};

export const pinCollection = colId => dispatch => {
  console.log("Pinning collection");
  axios.post(`/pinCollection/${colId}`).catch(err => {
    console.log(err.response.data);
  });
};

export const unpinCollection = colId => dispatch => {
  console.log("Unpinning collection");
  axios.post(`/unpinCollection/${colId}`).catch(err => {
    console.log(err.response.data);
  });
};

export const openCollectionDialog = () => dispatch => {
  dispatch({ type: OPEN_COLLECTION_DIALOG });
};

export const closeCollectionDialog = () => dispatch => {
  dispatch({ type: CLOSE_COLLECTION_DIALOG });
};

export const addDeckToCollection = (colId, deckId) => dispatch => {
  console.log(`Adding ${colId} ; ${deckId}`);
  axios
    .post(`/addDeckToCollection/${colId}/${deckId}`)
    .then(() => {
      return false;
    })
    .catch(err => {
      console.log(err.response.data);
    });
};
