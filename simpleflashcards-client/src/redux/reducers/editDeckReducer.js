import { SET_EDIT_DECK_DATA, DELETE_EDIT_DECK_DATA } from "../types";

const initialState = {
  deckName: "",
  deckDescription: "",
  deckImage: null,
  deckCards: [],
  imageUrl: null,
  private: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_EDIT_DECK_DATA:
      return {
        ...state,
        deckName: action.payload.deckName,
        deckDescription: action.payload.deckDescription,
        deckCards: action.payload.cardArray,
        imageUrl: action.payload.deckImage,
        private: action.payload.private
      };
    case DELETE_EDIT_DECK_DATA:
      return {
        deckName: "",
        deckDescription: "",
        deckImage: null,
        deckCards: [],
        imageUrl: null,
        private: false
      };
    default:
      return state;
  }
}
