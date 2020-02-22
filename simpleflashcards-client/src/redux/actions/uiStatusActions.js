import { CLEAR_STATUS } from "../types";

export const clearStatus = () => dispatch => {
  dispatch({ type: CLEAR_STATUS });
};
