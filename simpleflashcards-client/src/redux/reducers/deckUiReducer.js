import {
  SET_USER_DECKS,
  SET_PINNED_DECKS,
  CLEAR_PINNED_DECKS,
  CLEAR_USER_DECKS,
  SET_DECK,
  CLEAR_DECK,
  LOADING_DECK_UI
} from "../types";

const initialState = {
  userDecks: [],
  pinnedDecks: [],
  deck: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_DECKS:
      return {
        ...state,
        loading: false,
        userDecks: action.payload
      };
    case SET_PINNED_DECKS:
      return {
        ...state,
        loading: false,
        pinnedDecks: action.payload
      };
    case CLEAR_PINNED_DECKS:
      return {
        ...state,
        loading: false,
        pinnedDecks: []
      };
    case CLEAR_USER_DECKS:
      return {
        ...state,
        loading: false,
        userDecks: []
      };
    case SET_DECK:
      return {
        ...state,
        loading: false,
        deck: action.payload.deck
      };
    case CLEAR_DECK:
      return {
        ...state,
        loading: false,
        deck: null
      };
    case LOADING_DECK_UI:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
