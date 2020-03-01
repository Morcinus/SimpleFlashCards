import { CLEAR_STATUS } from "../types";
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
