import { SET_USER_DECKS, SET_PINNED_DECKS, CLEAR_PINNED_DECKS, CLEAR_USER_DECKS, SET_DECK, CLEAR_DECK } from "../types";

/**
 * @module deckUiReducer
 * @category ReduxReducers
 * @description Uchovává data a informace o balíčkách.
 */

/**
 * @type {Object} initialState
 * @description Původní stav reduceru
 * @property {Object} initialState - původní stav reduceru
 * @property {Array<Object>} initialState.userDecks - Uchovává balíčky vytvořené daným uživatelem.
 * @property {Array<Object>} initialState.pinnedDecks - Uchovává "připnuté" (=uložené) balíčky daného uživatele.
 * @property {Object} initialState.deck - Uchovává podrobná data o daném balíčku.
 */
const initialState = {
  userDecks: [],
  pinnedDecks: [],
  deck: null
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
    case SET_USER_DECKS:
      return {
        ...state,
        userDecks: action.payload
      };
    case SET_PINNED_DECKS:
      return {
        ...state,
        pinnedDecks: action.payload
      };
    case CLEAR_PINNED_DECKS:
      return {
        ...state,
        pinnedDecks: []
      };
    case CLEAR_USER_DECKS:
      return {
        ...state,
        userDecks: []
      };
    case SET_DECK:
      return {
        ...state,
        deck: action.payload.deck
      };
    case CLEAR_DECK:
      return {
        ...state,
        deck: null
      };
    default:
      return state;
  }
}
