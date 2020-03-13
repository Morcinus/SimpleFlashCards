import { SET_STATUS_BUSY, SET_STATUS_ERROR, SET_STATUS_SUCCESS, CLEAR_STATUS, OPEN_ERROR_ALERT, CLOSE_ERROR_ALERT } from "../types";

// UI Status
const BUSY = "BUSY";
const ERROR = "ERROR";
const SUCCESS = "SUCCESS";

/**
 * @module uiStatusReducer
 * @category ReduxReducers
 * @description Uchovává informace o stavu aplikace.
 */

/**
 * @type {Object} initialState
 * @description Původní stav reduceru.
 * @property {Object} initialState - Původní stav reduceru.
 * @property {string|null} initialState.status - Uchovává status aplikace, nabývá hodnot "BUSY", "ERROR", "SUCCESS", null.
 * @property {Array<String>} initialState.errorCodes - Uchovává error kódy.
 * @property {Array<String>} initialState.successCodes - Uchovává success kódy.
 * @property {boolean} initialState.globalErrorAlertOpen - Určuje, jestli má být otevřené errorové okno v GlobalErrorAlert komponentu.
 */
const initialState = {
  status: null,
  errorCodes: [],
  successCodes: [],
  globalErrorAlertOpen: false
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
    case SET_STATUS_BUSY:
      return {
        ...state,
        errorCodes: [],
        successCodes: [],
        status: BUSY
      };
    case SET_STATUS_ERROR:
      return {
        ...state,
        errorCodes: [...state.errorCodes, action.payload],
        status: ERROR
      };
    case SET_STATUS_SUCCESS:
      return {
        ...state,
        status: SUCCESS,
        successCodes: action.payload ? [...state.successCodes, action.payload] : [...state.successCodes]
      };
    case OPEN_ERROR_ALERT:
      return {
        ...state,
        globalErrorAlertOpen: true
      };
    case CLOSE_ERROR_ALERT:
      return {
        ...state,
        globalErrorAlertOpen: false
      };
    case CLEAR_STATUS:
      return { status: null, errorCodes: [], successCodes: [], globalErrorAlertOpen: false };
    default:
      return state;
  }
}
