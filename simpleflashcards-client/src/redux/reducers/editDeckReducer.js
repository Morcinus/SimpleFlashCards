import { SET_EDIT_DECK_DATA, DELETE_EDIT_DECK_DATA } from "../types";

/**
 * @module editDeckReducer
 * @category ReduxReducers
 * @description Uchovává data o upravovaném balíčku.
 */

/**
 * @type {Object} initialState
 * @description Původní stav reduceru
 * @property {Object} initialState - původní stav reduceru
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
 * @param {Object} state - stav reduceru
 * @param {Object} action - akce, která vyvolává změnu v reduceru
 * @returns nový stav reduceru
 */
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
      return initialState;
    default:
      return state;
  }
}
