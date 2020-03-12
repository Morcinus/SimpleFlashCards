import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

// Reducers
import userReducer from "./reducers/userReducer";
import uiStatusReducer from "./reducers/uiStatusReducer";
import createDeckReducer from "./reducers/createDeckReducer";
import editDeckReducer from "./reducers/editDeckReducer";
import deckUiReducer from "./reducers/deckUiReducer";
import deckStudyReducer from "./reducers/deckStudyReducer";
import colUiReducer from "./reducers/colUiReducer";
import colStudyReducer from "./reducers/colStudyReducer";
import editColReducer from "./reducers/editColReducer";
import { logoutUser } from "./actions/userActions";

/**
 * @category Ostatní
 * @module store
 * @description Zde se ze všech reducerů vytvoří store, který uchovává všechny hodnoty.
 */

const initialState = {};

/**
 * Store middleware, který kontroluje, jestli uživateli neskončila platnost tokenu. Pokud platnost skončila, uživatele odhlásí.
 * @function tokenExpirationMiddleware
 * @param {Object} store - Store aplikace.
 * @param {Object} next - Funkce, která spustí pokračování zpracovávání dané akce.
 * @param {Object} action - Akce, která vyvolala změnu ve store.
 */
const tokenExpirationMiddleware = store => next => action => {
  if (action.payload === "auth/id-token-expired") {
    store.dispatch(logoutUser());
  } else {
    next(action);
  }
};

const middleware = [thunk, tokenExpirationMiddleware];

/**
 * @constant reducers
 * @type {Object} reducers
 * @description Seznam všech reducerů.
 * @property {Object} reducers - Seznam všech reducerů.
 * @property {Object} reducers.user - [userReducer]{@link module:userReducer}
 * @property {Object} reducers.uiStatus - [uiStatusReducer]{@link module:uiStatusReducer}
 * @property {Object} reducers.deckCreation - [createDeckReducer]{@link module:createDeckReducer}
 * @property {Object} reducers.deckEdit - [editDeckReducer]{@link module:editDeckReducer}
 * @property {Object} reducers.deckUi - [deckUiReducer]{@link module:deckUiReducer}
 * @property {Object} reducers.deckStudy - [deckStudyReducer]{@link module:deckStudyReducer}
 * @property {Object} reducers.colUi - [colUiReducer]{@link module:colUiReducer}
 * @property {Object} reducers.colStudy - [colStudyReducer]{@link module:colStudyReducer}
 * @property {Object} reducers.colEdit - [editColReducer]{@link module:editColReducer}
 */
const reducers = combineReducers({
  user: userReducer,
  uiStatus: uiStatusReducer,
  deckCreation: createDeckReducer,
  deckEdit: editDeckReducer,
  deckUi: deckUiReducer,
  deckStudy: deckStudyReducer,
  colUi: colUiReducer,
  colStudy: colStudyReducer,
  colEdit: editColReducer
});

const store = createStore(
  reducers,
  initialState,
  compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f)
);

export default store;
