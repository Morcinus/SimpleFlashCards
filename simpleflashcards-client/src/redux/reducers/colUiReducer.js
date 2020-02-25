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
  SET_COL_DIALOG_STATUS_BUSY,
  SET_COL_DIALOG_STATUS_ERROR,
  SET_COL_DIALOG_STATUS_SUCCESS,
  CLEAR_COL_DIALOG_STATUS
} from "../types";

// ColDialog Status
const BUSY = "BUSY";
const ERROR = "ERROR";
const SUCCESS = "SUCCESS";

/**
 * @module colUiReducer
 * @category ReduxReducers
 * @description Uchovává data a informace o kolekcích.
 */

/**
 * @type {Object} initialState
 * @description Původní state reduceru
 * @property {Object} initialState - Původní state reduceru
 * @property {Array<Object>} initialState.userCollections - Uchovává kolekce vytvořené daným uživatelem.
 * @property {Array<Object>} initialState.pinnedCollections - Uchovává "připnuté" (=uložené) kolekce daného uživatele.
 * @property {boolean} initialState.collectionDialogOpen - Uchovává informaci, zda je otevřený/uzavřený CollectionDialog.
 * @property {string|null} initialState.colDialogStatus - Uchovává error kódy CollectionDialogu, nabývá hodnot "BUSY", "ERROR", "SUCCESS", null.
 * @property {Array<String>} initialState.colDialogErrorCodes - Uchovává error kódy CollectionDialogu.
 * @property {Array<String>} initialState.colDialogSuccessCodes - Uchovává success kódy CollectionDialogu.
 */
const initialState = {
  userCollections: [],
  pinnedCollections: [],
  collectionDialogOpen: false,
  colDialogStatus: null,
  colDialogErrorCodes: [],
  colDialogSuccessCodes: []
};

/**
 * @function function
 * @description Mění state reduceru.
 * @param {Object} state - state reduceru
 * @param {Object} action - action, která vyvolává změnu v reduceru
 * @returns nový state
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_COLLECTIONS:
      return {
        ...state,
        userCollections: action.payload
      };
    case SET_PINNED_COLLECTIONS:
      return {
        ...state,
        pinnedCollections: action.payload
      };
    case CLEAR_PINNED_COLLECTIONS:
      return {
        ...state,
        pinnedCollections: []
      };
    case CLEAR_USER_COLLECTIONS:
      return {
        ...state,
        userCollections: []
      };
    case SET_COLLECTION:
      return {
        ...state,
        collection: action.payload.collection
      };
    case CLEAR_COLLECTION:
      return {
        ...state,
        collection: null
      };
    case OPEN_COLLECTION_DIALOG:
      return {
        ...state,
        collectionDialogOpen: true
      };
    case CLOSE_COLLECTION_DIALOG:
      return {
        ...state,
        collectionDialogOpen: false
      };
    case ADD_DECK_TO_COLLECTION:
      return {
        ...state,
        userCollections: state.userCollections.map((userCollections, i) =>
          i === action.payload ? { ...userCollections, containsDeck: true } : userCollections
        ) // Source: https://stackoverflow.com/questions/35628774/how-to-update-single-value-inside-specific-array-item-in-redux
      };
    case SET_COL_DIALOG_STATUS_BUSY:
      return {
        ...state,
        colDialogErrorCodes: [],
        colDialogSuccessCodes: [],
        colDialogStatus: BUSY
      };
    case SET_COL_DIALOG_STATUS_ERROR:
      return {
        ...state,
        colDialogErrorCodes: [...state.colDialogErrorCodes, action.payload],
        colDialogStatus: ERROR
      };
    case SET_COL_DIALOG_STATUS_SUCCESS:
      return {
        ...state,
        colDialogStatus: SUCCESS,
        colDialogSuccessCodes: action.payload ? [...state.colDialogSuccessCodes, action.payload] : [...state.colDialogSuccessCodes]
      };
    case CLEAR_COL_DIALOG_STATUS:
      return {
        ...state,
        colDialogStatus: null,
        colDialogErrorCodes: [],
        colDialogSuccessCodes: []
      };
    default:
      return state;
  }
}
