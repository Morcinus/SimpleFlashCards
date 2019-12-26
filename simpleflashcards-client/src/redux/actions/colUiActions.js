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
