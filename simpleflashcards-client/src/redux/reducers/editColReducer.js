import {
  SET_EDIT_COLLECTION_DATA,
  DELETE_EDIT_COLLECTION_DATA
} from "../types";

const initialState = {
  colName: "",
  colDescription: "",
  deckArray: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_EDIT_COLLECTION_DATA:
      return {
        ...state,
        colName: action.payload.colName,
        colDescription: action.payload.colDescription,
        deckArray: action.payload.deckArray
      };
    case DELETE_EDIT_COLLECTION_DATA:
      return {
        colName: "",
        colDescription: "",
        deckArray: []
      };
    default:
      return state;
  }
}
