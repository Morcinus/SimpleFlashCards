import {
  SET_USER_COLLECTIONS,
  SET_PINNED_COLLECTIONS,
  CLEAR_PINNED_COLLECTIONS,
  CLEAR_USER_COLLECTIONS,
  SET_COLLECTION,
  CLEAR_COLLECTION,
  OPEN_COLLECTION_DIALOG,
  CLOSE_COLLECTION_DIALOG,
  ADD_DECK_TO_COLLECTION,
  SET_STATUS_BUSY,
  SET_STATUS_ERROR,
  SET_STATUS_SUCCESS,
  SET_COL_DIALOG_STATUS_BUSY,
  SET_COL_DIALOG_STATUS_ERROR,
  SET_COL_DIALOG_STATUS_SUCCESS,
  CLEAR_COL_DIALOG_STATUS
} from "../types";
import axios from "axios";

export const getUserCollections = () => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getUserCollections`)
    .then(res => {
      dispatch({ type: SET_USER_COLLECTIONS, payload: res.data });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const clearUserCollections = () => dispatch => {
  dispatch({ type: CLEAR_USER_COLLECTIONS });
};

export const getPinnedCollections = () => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getPinnedCollections`)
    .then(res => {
      dispatch({ type: SET_PINNED_COLLECTIONS, payload: res.data });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const clearPinnedCollections = () => dispatch => {
  dispatch({ type: CLEAR_PINNED_COLLECTIONS });
};

export const getUserCollectionsWithDeckInfo = deckId => dispatch => {
  dispatch({ type: SET_COL_DIALOG_STATUS_BUSY });
  axios
    .get(`/getUserCollectionsWithDeckInfo/${deckId}`)
    .then(res => {
      dispatch({ type: SET_USER_COLLECTIONS, payload: res.data });
      dispatch({ type: SET_COL_DIALOG_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_COL_DIALOG_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const getCollection = colId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getCollection/${colId}`)
    .then(res => {
      dispatch({ type: SET_COLLECTION, payload: res.data });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const clearCollection = () => dispatch => {
  dispatch({ type: CLEAR_COLLECTION });
};

export const pinCollection = colId => dispatch => {
  axios.post(`/pinCollection/${colId}`).catch(err => {
    console.error("Error:", err.response.data.errorCode);
    dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
  });
};

export const unpinCollection = colId => dispatch => {
  axios.post(`/unpinCollection/${colId}`).catch(err => {
    console.error("Error:", err.response.data.errorCode);
    dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
  });
};

export const openCollectionDialog = () => dispatch => {
  dispatch({ type: OPEN_COLLECTION_DIALOG });
};

export const closeCollectionDialog = () => dispatch => {
  dispatch({ type: CLOSE_COLLECTION_DIALOG });
  dispatch({ type: CLEAR_COL_DIALOG_STATUS });
};

export const addDeckToCollection = (colId, deckId, i) => dispatch => {
  dispatch({ type: SET_COL_DIALOG_STATUS_BUSY });
  axios
    .post(`/addDeckToCollection/${colId}/${deckId}`)
    .then(() => {
      dispatch({ type: ADD_DECK_TO_COLLECTION, payload: i });
      dispatch({ type: SET_COL_DIALOG_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_COL_DIALOG_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const createCollection = (colName, deckId, privateCol) => dispatch => {
  // CollectionName validation
  const errorCode = validateUploadCollectionName(colName);

  if (errorCode !== null) {
    dispatch({ type: SET_COL_DIALOG_STATUS_ERROR, payload: errorCode });
  } else {
    let exportData = {
      colName: colName,
      deckArray: [deckId],
      private: privateCol
    };

    dispatch({ type: SET_COL_DIALOG_STATUS_BUSY });
    axios
      .post(`/createCollection`, exportData)
      .then(res => {
        dispatch({ type: SET_COL_DIALOG_STATUS_SUCCESS, payload: res.data.successCode });
      })
      .catch(err => {
        console.error("Error:", err.response.data.errorCode);
        dispatch({ type: SET_COL_DIALOG_STATUS_ERROR, payload: err.response.data.errorCode });
      });
  }
};

const validateUploadCollectionName = colName => {
  // CollectionName validation
  if (colName !== "") {
    let colNameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!colName.match(colNameRegex)) {
      return "createCollection/invalid-collection-name";
    }
  } else {
    return "createCollection/empty-collection-name";
  }

  return null;
};
