import { SET_STUDY_COLLECTION, CLEAR_STUDY_COLLECTION } from "../types";

/**
 * @module colStudyReducer
 * @category ReduxReducers
 * @description Uchovává data o kolekci, kterou se uživatel učí.
 */

/**
 * @type {Object} initialState
 * @description Původní stav reduceru
 * @property {Object} initialState - původní stav reduceru
 * @property {Array<Object>} initialState.currentDeck - Uchovává data o kolekci, kterou se uživatel učí.
 */
const initialState = {
  currentColCards: []
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
    case SET_STUDY_COLLECTION:
      return {
        ...state,
        currentColCards: action.payload
      };
    case CLEAR_STUDY_COLLECTION:
      return initialState;
    default:
      return state;
  }
}
