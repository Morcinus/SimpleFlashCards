import { SET_STUDY_DECK, CLEAR_STUDY_DECK } from "../types";

/**
 * @module deckStudyReducer
 * @category ReduxReducers
 * @description Uchovává data o balíčku, který se uživatel učí.
 */

/**
 * @type {Object} initialState
 * @description Původní stav reduceru.
 * @property {Object} initialState - Původní stav reduceru.
 * @property {Array<Object>} initialState.currentDeck - Uchovává data o balíčku, který se uživatel momentálně učí.
 */
const initialState = {
  currentDeck: []
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
    case SET_STUDY_DECK:
      return {
        ...state,
        currentDeck: action.payload
      };
    case CLEAR_STUDY_DECK:
      return initialState;
    default:
      return state;
  }
}
