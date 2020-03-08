import { UPDATE_DECK_DATA, DELETE_DECK_DATA } from "../types";

/**
 * @module createDeckReducer
 * @category ReduxReducers
 * @description Uchovává data o vytvářeném balíčku.
 */

/**
 * @type {Object} initialState
 * @description Původní stav reduceru.
 * @property {Object} initialState - Původní stav reduceru.
 * @property {string} initialState.deckName - Uchovává název balíčku.
 * @property {string} initialState.deckDescription - Uchovává popis balíčku.
 * @property {Object} initialState.deckImage - Uchovává obrázek balíčku.
 * @property {Array<Object>} initialState.deckCards - Uchovává karty balíčku.
 * @property {string} initialState.imageUrl - Uchovává adresu obrázku balíčku.
 * @property {boolean} initialState.private - Uchovává informaci, zda je balíček veřejný či soukromý.
 */
const initialState = {
  deckName: "",
  deckDescription: "",
  deckImage: null,
  deckCards: [],
  imageUrl: null,
  private: false
};

/**
 * @function function
 * @description Mění stav reduceru.
 * @param {Object} state - Stav reduceru.
 * @param {Object} action - Akce, která vyvolává změnu v reduceru.
 * @returns {Object} Nový stav reduceru.
 */
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
