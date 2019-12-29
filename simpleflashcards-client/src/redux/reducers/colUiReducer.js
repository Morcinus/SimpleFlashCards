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

const initialState = {
  userCollections: [],
  pinnedCollections: [],
  loading: false,
  collectionDialogOpen: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_COLLECTIONS:
      return {
        ...state,
        loading: false,
        userCollections: action.payload
      };
    case SET_PINNED_COLLECTIONS:
      return {
        ...state,
        loading: false,
        pinnedCollections: action.payload
      };
    case CLEAR_PINNED_COLLECTIONS:
      return {
        ...state,
        loading: false,
        pinnedCollections: []
      };
    case CLEAR_USER_COLLECTIONS:
      return {
        ...state,
        loading: false,
        userCollections: []
      };
    case SET_COLLECTION:
      return {
        ...state,
        loading: false,
        collection: action.payload.collection
      };
    case CLEAR_COLLECTION:
      return {
        ...state,
        loading: false,
        collection: null
      };
    case LOADING_COLLECTION_UI:
      return {
        ...state,
        loading: true
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
    default:
      return state;
  }
}
