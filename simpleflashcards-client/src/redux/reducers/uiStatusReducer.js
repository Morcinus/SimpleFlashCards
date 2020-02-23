import { SET_STATUS_BUSY, SET_STATUS_ERROR, SET_STATUS_SUCCESS, CLEAR_STATUS } from "../types";

// UI Status
const BUSY = "BUSY";
const ERROR = "ERROR";
const SUCCESS = "SUCCESS";

const initialState = {
  status: null,
  errorCodes: [],
  successCodes: []
};

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
    case CLEAR_STATUS:
      return initialState;
    default:
      return state;
  }
}
