import {
  SET_USER_DECKS,
  SET_PINNED_DECKS,
  CLEAR_PINNED_DECKS,
  CLEAR_USER_DECKS
} from "../types";

const initialState = {
  userDecks: [],
  pinnedDecks: []
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
    default:
      return state;
  }
}
