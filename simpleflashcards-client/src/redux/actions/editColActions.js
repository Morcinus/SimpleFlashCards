import { SET_EDIT_COLLECTION_DATA, DELETE_EDIT_COLLECTION_DATA, SET_STATUS_BUSY, SET_STATUS_ERROR, SET_STATUS_SUCCESS, CLEAR_STATUS } from "../types";
import axios from "axios";

export const deleteCollectionDraft = () => dispatch => {
  dispatch({ type: DELETE_EDIT_COLLECTION_DATA });
};

export const updateCollection = (colData, colId) => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });

  // Validate colData
  const errorCodes = validateUploadCollectionData(colData);
  if (errorCodes.length > 0) {
    errorCodes.forEach(errorCode => {
      console.error("Error:", errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: errorCode });
    });
  } else {
    // Push deckIDs to export array
    let exportDeckArray = [];
    colData.deckArray.forEach(deck => {
      exportDeckArray.push(deck.deckId);
    });

    // Create export deck data
    const exportDeckData = {
      colName: colData.colName,
      private: colData.private,
      deckArray: exportDeckArray,
      colDescription: colData.colDescription
    };

    axios
      .post(`/updateCollection/${colId}`, exportDeckData)
      .then(res => {
        dispatch({ type: SET_STATUS_SUCCESS, payload: res.data.successCode });
      })
      .catch(err => {
        console.error("Error:", err.response.data.errorCode);
        dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
      });
  }
};

export const getCollection = colId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getCollection/${colId}`)
    .then(res => {
      dispatch({
        type: SET_EDIT_COLLECTION_DATA,
        payload: res.data.collection
      });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

const validateUploadCollectionData = colData => {
  let errors = [];

  // DeckName validation
  if (colData.colName !== "") {
    let colNameRegex = /^[a-zA-Z0-9]+$/;
    if (!colData.colName.match(colNameRegex)) {
      errors.push("updateCollection/invalid-collection-name");
    }
  } else {
    errors.push("updateCollection/empty-collection-name");
  }

  // DeckCards validation
  if (colData.deckArray.length <= 0) {
    errors.push("updateCollection/empty-collection");
  }

  return errors;
};

export const deleteCollection = colId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .post(`/deleteCollection/${colId}`)
    .then(res => {
      dispatch({ type: DELETE_EDIT_COLLECTION_DATA });
      dispatch(deleteCollectionDraft());
      dispatch({ type: SET_STATUS_SUCCESS, payload: res.data.successCode });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};
