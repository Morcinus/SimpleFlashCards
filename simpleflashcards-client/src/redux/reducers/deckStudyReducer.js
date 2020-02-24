import { SET_STUDY_DECK, CLEAR_STUDY_DECK } from "../types";

const initialState = {
  currentDeck: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_STUDY_DECK:
      return {
        ...state,
        currentDeck: action.payload
      };
    case CLEAR_STUDY_DECK:
      return initialState;
    default:
      return state;
  }
}
