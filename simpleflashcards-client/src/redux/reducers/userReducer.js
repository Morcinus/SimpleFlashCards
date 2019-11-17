import {
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER_DATA,
  CLEAR_USER_DATA,
  SET_ONE_USER_DATA
} from "../types";

const initialState = {
  authenticated: false,
  credentials: {}
};

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
    default:
      return state;
  }
}
