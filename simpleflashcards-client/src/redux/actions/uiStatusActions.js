import { CLEAR_STATUS, OPEN_ERROR_ALERT, CLOSE_ERROR_ALERT } from "../types";
/**
 * @category ReduxActions
 * @module uiStatusActions
 * @description Zde jsou funkce, které  vyvolávají změny v [uiStatusReduceru]{@link module:uiStatusReducer}.
 */

/**
 * @function clearStatus
 * @description Vymaže všechny hodnoty o stavu aplikace v [uiStatusReduceru]{@link module:uiStatusReducer}.
 */
export const clearStatus = () => dispatch => {
  dispatch({ type: CLEAR_STATUS });
};

/**
 * @function openErrorAlert
 * @description Změní hodnotu globalErrorAlertOpen v [uiStatusReduceru]{@link module:uiStatusReducer} na true, čímž otevře globání errorové okno.
 */
export const openErrorAlert = () => dispatch => {
  dispatch({ type: OPEN_ERROR_ALERT });
};

/**
 * @function closeErrorAlert
 * @description Změní hodnotu globalErrorAlertOpen v [uiStatusReduceru]{@link module:uiStatusReducer} na false, čímž zavře globání errorové okno.
 */
export const closeErrorAlert = () => dispatch => {
  dispatch({ type: CLOSE_ERROR_ALERT });
};
