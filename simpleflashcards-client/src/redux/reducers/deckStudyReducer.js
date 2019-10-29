import { SET_STUDY_DECK, CLEAR_STUDY_DECK, LOADING_DECK } from "../types";

const initialState = {
  currentDeck: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_STUDY_DECK:
      return {
        ...state,
        currentDeck: action.payload,
        loading: false
      };
    case CLEAR_STUDY_DECK:
      return {
        ...state,
        currentDeck: [],
        loading: false
      };
    case LOADING_DECK:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
