import { SET_EDIT_COLLECTION_DATA, DELETE_EDIT_COLLECTION_DATA } from "../types";

/**
 * @module editColReducer
 * @category ReduxReducers
 * @description Uchovává data o upravované kolekci.
 */

/**
 * @type {Object} initialState
 * @description Původní stav reduceru.
 * @property {Object} initialState - Původní stav reduceru.
 * @property {string} initialState.colName - Uchovává název kolekce.
 * @property {string} initialState.colDescription - Uchovává popis kolekce.
 * @property {Array<Object>} initialState.deckArray - Uchovává balíčky obsažené v kolekci.
 * @property {boolean} initialState.private - Uchovává informaci, zda je balíček veřejný či soukromý.
 */
const initialState = {
  colName: "",
  colDescription: "",
  deckArray: [],
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
