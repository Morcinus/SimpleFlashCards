import { SET_EDIT_COLLECTION_DATA, DELETE_EDIT_COLLECTION_DATA, SET_ERRORS, CLEAR_ERRORS } from "../types";
import axios from "axios";

export const uploadCollection = (colData, colId) => dispatch => {
  const errors = validateUploadDeckData(colData);
  if (Object.keys(errors).length !== 0) {
    dispatch({ type: SET_ERRORS, payload: errors });
    return true;
  } else {
    let exportDeckArray = [];
    colData.deckArray.forEach(deck => {
      console.log("Deck: ", deck);
      console.log("DeckID: ", deck.deckId);
      exportDeckArray.push(deck.deckId);
    });
    // Osetrit jestli neni prazdny
    const exportDeckData = {
      colName: colData.colName,
      private: colData.private,
      deckArray: exportDeckArray,
      colDescription: colData.colDescription
    };
    console.log("ExportData: ", exportDeckData);
    axios.post(`/updateCollection/${colId}`, exportDeckData).catch(err => {
      if (err.response) console.log(err.response.data);
    });
    dispatch({ type: CLEAR_ERRORS });
    return false;
  }
};

export const getCollection = colId => dispatch => {
  axios
    .get(`/getCollection/${colId}`)
    .then(res => {
      console.log(res.data);
      dispatch({
        type: SET_EDIT_COLLECTION_DATA,
        payload: res.data.collection
      });
    })
    .catch(err => console.log(err));
};

const validateUploadDeckData = colData => {
  let errors = {};

  // Collection Name
  if (colData.colName === "") {
    errors.colNameError = "Collection name must not be empty!";
  }

  // Collection Decks
  if (colData.deckArray.length <= 0) {
    errors.deckArrayError = "There must be at least one deck!";
  }

  return errors;
};

export const deleteCollection = colId => dispatch => {
  axios
    .post(`/deleteCollection/${colId}`)
    .then(() => {
      console.log("Deck Deleted!");
      dispatch({ type: DELETE_EDIT_COLLECTION_DATA });
    })
    .catch(err => {
      if (err.response) console.log(err.response.data);
    });
};

export const deleteCollectionDraft = () => dispatch => {
  dispatch({ type: DELETE_EDIT_COLLECTION_DATA });
};
