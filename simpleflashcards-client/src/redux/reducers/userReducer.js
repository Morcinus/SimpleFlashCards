import { SET_AUTHENTICATED, SET_UNAUTHENTICATED, SET_USER_DATA, CLEAR_USER_DATA, SET_ONE_USER_DATA, SET_USER_PROFILE, CLEAR_USER_PROFILE } from "../types";

/**
 * @module userReducer
 * @category ReduxReducers
 * @description Uchovává data a informace o uživateli.
 */

/**
 * @type {Object} initialState
 * @description Původní stav reduceru.
 * @property {Object} initialState - Původní stav reduceru.
 * @property {boolean} initialState.authenticated - Uchovává informaci, zda-li je uživatel přihlášený a autentizovaný.
 * @property {Object} initialState.credentials - Uchovává data o přihlášeném uživateli.
 * @property {Object} initialState.userProfile - Uchovává data o profilu uživatele.
 */
const initialState = {
  authenticated: false,
  credentials: {},
  userProfile: {}
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
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER_DATA:
      return {
        ...state,
        credentials: action.payload
      };
    case SET_ONE_USER_DATA:
      return {
        ...state,
        credentials: { ...state.credentials, ...action.payload }
      };
    case CLEAR_USER_DATA:
      return {
        ...state,
        credentials: {}
      };
    case SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload
      };
    case CLEAR_USER_PROFILE:
      return {
        ...state,
        userProfile: {}
      };
    default:
      return state;
  }
}
