import { UPDATE_DECK_DATA, DELETE_DECK_DATA } from "../types";

const initialState = {
  deckName: "",
  deckDescription: "",
  deckImage: null,
  deckCards: [],
  imageUrl: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_DECK_DATA:
      return {
        ...state,
        deckName: action.payload.deckName,
        deckDescription: action.payload.deckDescription,
        deckImage: action.payload.deckImage,
        deckCards: action.payload.deckCards,
        imageUrl: action.payload.imageUrl
      };
    case DELETE_DECK_DATA:
      return {
        deckName: "",
        deckDescription: "",
        deckImage: null,
        deckCards: [],
        imageUrl: null
      };
    default:
      return state;
  }
}
