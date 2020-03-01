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

const initialState = {};

const middleware = [thunk];

/**
 * @category Ostatní
 * @module store
 * @description Zde se ze všech reducerů vytvoří store, který uchovává všechny hodnoty.
 */

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
