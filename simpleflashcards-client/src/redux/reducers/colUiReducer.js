import {
  SET_USER_COLLECTIONS,
  SET_PINNED_COLLECTIONS,
  CLEAR_PINNED_COLLECTIONS,
  CLEAR_USER_COLLECTIONS,
  SET_COLLECTION,
  CLEAR_COLLECTION,
  LOADING_COLLECTION_UI
} from "../types";

const initialState = {
  userCollections: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_COLLECTIONS:
      return {
        ...state,
        loading: false,
        userCollections: action.payload
      };
    //   case SET_PINNED_DECKS:
    //     return {
    //       ...state,
    //       loading: false,
    //       pinnedDecks: action.payload
    //     };
    //   case CLEAR_PINNED_DECKS:
    //     return {
    //       ...state,
    //       loading: false,
    //       pinnedDecks: []
    //     };
    case CLEAR_USER_COLLECTIONS:
      return {
        ...state,
        loading: false,
        userCollections: []
      };
    //   case SET_DECK:
    //     return {
    //       ...state,
    //       loading: false,
    //       deck: action.payload.deck
    //     };
    //   case CLEAR_DECK:
    //     return {
    //       ...state,
    //       loading: false,
    //       deck: null
    //     };
    case LOADING_COLLECTION_UI:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
