import { SET_EDIT_COLLECTION_DATA, DELETE_EDIT_COLLECTION_DATA } from "../types";

const initialState = {
  colName: "",
  colDescription: "",
  deckArray: [],
  private: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_EDIT_COLLECTION_DATA:
      return {
        ...state,
        colName: action.payload.colName,
        colDescription: action.payload.colDescription,
        private: action.payload.private,
        deckArray: action.payload.deckArray
      };
    case DELETE_EDIT_COLLECTION_DATA:
      return initialState;
    default:
      return state;
  }
}
