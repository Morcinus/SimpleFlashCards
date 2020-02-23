import { UPDATE_DECK_DATA, DELETE_DECK_DATA } from "../types";

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
    case UPDATE_DECK_DATA:
      return {
        ...state,
        deckName: action.payload.deckName,
        deckDescription: action.payload.deckDescription,
        deckImage: action.payload.deckImage,
        deckCards: action.payload.deckCards,
        imageUrl: action.payload.imageUrl,
        private: action.payload.private
      };
    case DELETE_DECK_DATA:
      return initialState;
    default:
      return state;
  }
}
