import { SET_EDIT_COLLECTION_DATA, DELETE_EDIT_COLLECTION_DATA, SET_STATUS_BUSY, SET_STATUS_ERROR, SET_STATUS_SUCCESS } from "../types";
import { openErrorAlert } from "./uiStatusActions";
import axios from "axios";
import { DECK_COL_NAME_REGEX } from "../../util/other";

/**
 * @category ReduxActions
 * @module editColActions
 * @description Zde jsou funkce, které komunikují se serverem ohledně upravování kolekcí a vyvolávají změny v [editColReduceru]{@link module:editColReducer} a [uiStatusReduceru]{@link module:uiStatusReducer}.
 */

/**
 * @function deleteCollectionDraft
 * @description Vymaže data kolekce z [editColReduceru]{@link module:editColReducer}.
 */
export const deleteCollectionDraft = () => dispatch => {
  dispatch({ type: DELETE_EDIT_COLLECTION_DATA });
};

/**
 * @function updateCollection
 * @description Nahraje na server novou verzi kolekce.
 * @param {Object} colData - Data kolekce.
 * @param {string} colId - ID upravované kolekce.
 * @async
 */
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
        if (err.response) {
          if (err.response.data.errorCodes) {
            err.response.data.errorCodes.forEach(errorCode => {
              console.error("Error:", errorCode);
              dispatch({ type: SET_STATUS_ERROR, payload: errorCode });
            });
          } else {
            console.error("Error:", err.response.data.errorCode);
            dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
          }
        } else dispatch(openErrorAlert());
      });
  }
};

/**
 * @function getCollection
 * @description Získá ze serveru data o kolekci na základě jejího ID. Data pak uloží do [editColReduceru]{@link module:editColReducer}.
 * @param {string} colId - Data kolekce.
 * @async
 */
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
      if (err.response) {
        console.error("Error:", err.response.data.errorCode);
        dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
      } else dispatch(openErrorAlert());
    });
};

/**
 * @function validateUploadCollectionData
 * @description Ověří, zda jsou data kolekci platná.
 * @param {Object} colData - Data kolekce.
 * @returns {Array<String>} Vrací pole error kódů. Pokud jsou všechna data planá, vrací prázdné pole.
 */
const validateUploadCollectionData = colData => {
  let errors = [];

  // CollectionName validation
  if (colData.colName !== "") {
    if (!colData.colName.match(DECK_COL_NAME_REGEX)) {
      console.log("e");
      errors.push("updateCollection/invalid-collection-name");
    }
  } else {
    errors.push("updateCollection/empty-collection-name");
  }

  // CollectionDecks validation
  if (colData.deckArray.length <= 0) {
    errors.push("updateCollection/empty-collection");
  }

  return errors;
};

/**
 * @function deleteCollection
 * @description Pošle na server požadavek, aby byla daná kolekce smazána.
 * @param {string} colId - ID kolekce.
 * @async
 */
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
      if (err.response) {
        console.error("Error:", err.response.data.errorCode);
        dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
      } else dispatch(openErrorAlert());
    });
};
