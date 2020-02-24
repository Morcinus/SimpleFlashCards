import { SET_STUDY_COLLECTION, CLEAR_STUDY_COLLECTION } from "../types";

const initialState = {
  currentColCards: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_STUDY_COLLECTION:
      return {
        ...state,
        currentColCards: action.payload
      };
    case CLEAR_STUDY_COLLECTION:
      return initialState;
    default:
      return state;
  }
}
