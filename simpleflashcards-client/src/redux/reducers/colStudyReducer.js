import {
  SET_STUDY_COLLECTION,
  CLEAR_STUDY_COLLECTION,
  LOADING_COLLECTION
} from "../types";

const initialState = {
  currentColCards: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_STUDY_COLLECTION:
      return {
        ...state,
        currentColCards: action.payload,
        loading: false
      };
    case CLEAR_STUDY_COLLECTION:
      return {
        ...state,
        currentColCards: [],
        loading: false
      };
    case LOADING_COLLECTION:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
