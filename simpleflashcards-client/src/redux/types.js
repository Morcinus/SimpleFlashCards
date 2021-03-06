/**
 * @module types
 * @category Ostatní
 * @description Zde jsou všechny konstanty, které určují typy akcí pro Redux.
 */

// User reducer types
export const SET_AUTHENTICATED = "SET_AUTHENTICATED";
export const SET_UNAUTHENTICATED = "SET_UNAUTHENTICATED";
export const SET_USER_DATA = "SET_USER_DATA";
export const SET_ONE_USER_DATA = "SET_ONE_USER_DATA";
export const CLEAR_USER_DATA = "CLEAR_USER_DATA";
export const LOADING_USER = "LOADING_USER";
export const SET_USER_PROFILE = "SET_USER_PROFILE";
export const CLEAR_USER_PROFILE = "CLEAR_USER_DATA";

// UI status reducer types
export const SET_STATUS_BUSY = "SET_STATUS_BUSY";
export const SET_STATUS_ERROR = "SET_STATUS_ERROR";
export const SET_STATUS_SUCCESS = "SET_STATUS_SUCCESS";
export const CLEAR_STATUS = "CLEAR_STATUS";
export const OPEN_ERROR_ALERT = "OPEN_ERROR_ALERT";
export const CLOSE_ERROR_ALERT = "CLOSE_ERROR_ALERT";

// Create Deck reducer types
export const UPDATE_DECK_DATA = "UPDATE_DECK_DATA";
export const DELETE_DECK_DATA = "DELETE_DECK_DATA";

// Edit Deck reducer types
export const SET_EDIT_DECK_DATA = "SET_EDIT_DECK_DATA";
export const DELETE_EDIT_DECK_DATA = "DELETE_DECK_DATA";

// Deck Ui reducer types
export const SET_USER_DECKS = "SET_USER_DECKS";
export const CLEAR_USER_DECKS = "CLEAR_USER_DECKS";
export const SET_PINNED_DECKS = "SET_PINNED_DECKS";
export const CLEAR_PINNED_DECKS = "CLEAR_PINNED_DECKS";
export const SET_DECK = "SET_DECK";
export const CLEAR_DECK = "CLEAR_DECK";

// Study deck reducer types
export const SET_STUDY_DECK = "SET_STUDY_DECK";
export const CLEAR_STUDY_DECK = "CLEAR_STUDY_DECK";

// Collection Ui reducer types
export const SET_USER_COLLECTIONS = "SET_USER_COLLECTIONS";
export const CLEAR_USER_COLLECTIONS = "CLEAR_USER_COLLECTIONS";
export const SET_PINNED_COLLECTIONS = "SET_PINNED_COLLECTIONS";
export const CLEAR_PINNED_COLLECTIONS = "CLEAR_PINNED_COLLECTIONS";
export const SET_COLLECTION = "SET_COLLECTION";
export const CLEAR_COLLECTION = "CLEAR_COLLECTION";
export const ADD_DECK_TO_COLLECTION = "ADD_DECK_TO_COLLECTION";

// Collection Dialog reducer types
export const OPEN_COLLECTION_DIALOG = "OPEN_COLLECTION_DIALOG";
export const CLOSE_COLLECTION_DIALOG = "CLOSE_COLLECTION_DIALOG";
export const SET_COL_DIALOG_STATUS_BUSY = "SET_COL_DIALOG_STATUS_BUSY";
export const SET_COL_DIALOG_STATUS_ERROR = "SET_COL_DIALOG_STATUS_ERROR";
export const SET_COL_DIALOG_STATUS_SUCCESS = "SET_COL_DIALOG_STATUS_SUCCESS";
export const CLEAR_COL_DIALOG_STATUS = "CLEAR_COL_DIALOG_STATUS";

// Edit Collection reducer types
export const SET_EDIT_COLLECTION_DATA = "SET_EDIT_COLLECTION_DATA";
export const DELETE_EDIT_COLLECTION_DATA = "DELETE_COLLECTION_DATA";

// Study collection reducer types
export const SET_STUDY_COLLECTION = "SET_STUDY_COLLECTION";
export const CLEAR_STUDY_COLLECTION = "CLEAR_STUDY_COLLECTION";
