import {
  SET_USER_DECKS,
  SET_PINNED_DECKS,
  CLEAR_PINNED_DECKS,
  CLEAR_USER_DECKS,
  SET_DECK,
  CLEAR_DECK
} from "../types";

const initialState = {
  userDecks: [],
  pinnedDecks: [],
  deck: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_DECKS:
      return {
        ...state,
        userDecks: action.payload
      };
    case SET_PINNED_DECKS:
      return {
        ...state,
        pinnedDecks: action.payload
      };
    case CLEAR_PINNED_DECKS:
      return {
        ...state,
        pinnedDecks: []
      };
    case CLEAR_USER_DECKS:
      return {
        ...state,
        userDecks: []
      };
    case SET_DECK:
      return {
        ...state,
        deck: action.payload.deck
      };
    case CLEAR_DECK:
      return {
        ...state,
        deck: null
      };
    default:
      return state;
  }
}
