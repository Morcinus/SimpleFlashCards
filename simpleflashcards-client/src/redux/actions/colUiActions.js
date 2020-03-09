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
import { DECK_COL_NAME_REGEX } from "../../util/other";

/**
 * @category ReduxActions
 * @module colUiActions
 * @description Zde jsou funkce, které komunikují se serverem ohledně kolekcí a vyvolávají změny v [colUiReduceru]{@link module:colUiReducer} a [uiStatusReduceru]{@link module:uiStatusReducer}.
 */

/**
 * @function getUserCollections
 * @description Získá ze serveru seznam kolekcí vytvořených uživatelem a uloží ho do [colUiReduceru]{@link module:colUiReducer}.
 * @async
 */
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

/**
 * @function clearUserCollections
 * @description Vymaže seznam kolekcí vytvořených uživatelem z [colUiReduceru]{@link module:colUiReducer}.
 */
export const clearUserCollections = () => dispatch => {
  dispatch({ type: CLEAR_USER_COLLECTIONS });
};

/**
 * @function getPinnedCollections
 * @description Získá ze serveru seznam kolekcí připnutých uživatelem a uloží ho do [colUiReduceru]{@link module:colUiReducer}.
 * @async
 */
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

/**
 * @function clearPinnedCollections
 * @description Vymaže seznam kolekcí připnutých uživatelem z [colUiReduceru]{@link module:colUiReducer}.
 */
export const clearPinnedCollections = () => dispatch => {
  dispatch({ type: CLEAR_PINNED_COLLECTIONS });
};

/**
 * @function getUserCollectionsWithDeckInfo
 * @description Získá ze serveru seznam kolekcí vytvořených uživatelem společně s informacemi, zda je daný balíček v kolekcích obsažen nebo ne. Tento seznam pak funkce uloží ho do [colUiReduceru]{@link module:colUiReducer}.
 * @param {string} deckId - ID balíčku, o kterém se má zjistit, zda je obsažen v kolekci.
 * @async
 */
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

/**
 * @function getCollection
 * @description Získá ze serveru prodrobná data o dané kolekci a uloží je do [colUiReduceru]{@link module:colUiReducer}.
 * @param {string} colId - ID kolekce, o které se mají získat data.
 * @async
 */
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

/**
 * @function clearCollection
 * @description Smaže data o dané kolekci z [colUiReduceru]{@link module:colUiReducer}.
 */
export const clearCollection = () => dispatch => {
  dispatch({ type: CLEAR_COLLECTION });
};

/**
 * @function pinCollection
 * @description Pošle na server požadavek, aby byla připnuta daná kolekce.
 * @param {string} colId - ID kolekce, která má být připnuta.
 * @async
 */
export const pinCollection = colId => dispatch => {
  axios.post(`/pinCollection/${colId}`).catch(err => {
    console.error("Error:", err.response.data.errorCode);
    dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
  });
};

/**
 * @function unpinCollection
 * @description Pošle na server požadavek, aby byla odepnuta daná kolekce.
 * @param {string} colId - ID kolekce, která má být odepnuta.
 * @async
 */
export const unpinCollection = colId => dispatch => {
  axios.post(`/unpinCollection/${colId}`).catch(err => {
    console.error("Error:", err.response.data.errorCode);
    dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
  });
};

/**
 * @function openCollectionDialog
 * @description Pošle action do [colUiReduceru]{@link module:colUiReducer}, která nastaví [collectionDialogOpen]{@link module:colUiReducer~initialState} na true. Tím otevře CollectionDialog.
 */
export const openCollectionDialog = () => dispatch => {
  dispatch({ type: OPEN_COLLECTION_DIALOG });
};

/**
 * @function closeCollectionDialog
 * @description Pošle action do [colUiReduceru]{@link module:colUiReducer}, která nastaví [collectionDialogOpen]{@link module:colUiReducer~initialState} na false. Tím zavře CollectionDialog.
 */
export const closeCollectionDialog = () => dispatch => {
  dispatch({ type: CLOSE_COLLECTION_DIALOG });
  dispatch({ type: CLEAR_COL_DIALOG_STATUS });
};

/**
 * @function addDeckToCollection
 * @description Pošle na server požadavek, aby byl daný balíček přidán do kolekce.
 * @param {string} colId - ID kolekce, do které má být přidán balíček.
 * @param {string} deckId - ID balíčku, který má být do kolekce přidán.
 * @param {number} index - Index kolekce v poli kolekcí.
 * @async
 */
export const addDeckToCollection = (colId, deckId, index) => dispatch => {
  dispatch({ type: SET_COL_DIALOG_STATUS_BUSY });
  axios
    .post(`/addDeckToCollection/${colId}/${deckId}`)
    .then(() => {
      dispatch({ type: ADD_DECK_TO_COLLECTION, payload: index });
      dispatch({ type: SET_COL_DIALOG_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_COL_DIALOG_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

/**
 * @function createCollection
 * @description Pošle na server požadavek, aby byla vytvořena daná kolekce.
 * @param {string} colName - Název kolekce, která má být vytvořena.
 * @param {string} deckId - ID prvního balíčku, který bude kolekce obsahovat.
 * @param {boolean} privateCol - Určuje, zda bude kolekce veřejná nebo soukromá.
 * @async
 */

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

/**
 * @function validateUploadCollectionName
 * @description Ověří, zda je název kolekce platný.
 * @param {string} colName - Název kolekce, který má být ověřen.
 * @returns {null | string} Vrací null nebo error kód.
 */
const validateUploadCollectionName = colName => {
  // CollectionName validation
  if (colName !== "") {
    if (!colName.match(DECK_COL_NAME_REGEX)) {
      return "createCollection/invalid-collection-name";
    }
  } else {
    return "createCollection/empty-collection-name";
  }

  return null;
};
