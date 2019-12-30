import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

// Reducers
import userReducer from "./reducers/userReducer";
import uiReducer from "./reducers/uiReducer";
import createDeckReducer from "./reducers/createDeckReducer";
import editDeckReducer from "./reducers/editDeckReducer";
import deckUi from "./reducers/deckUiReducer";
import deckStudy from "./reducers/deckStudyReducer";
import colUi from "./reducers/colUiReducer";
import colStudy from "./reducers/colStudyReducer";
import editColReducer from "./reducers/editColReducer";

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
  user: userReducer,
  UI: uiReducer,
  deckCreation: createDeckReducer,
  deckEdit: editDeckReducer,
  deckUi: deckUi,
  deckStudy: deckStudy,
  colUi: colUi,
  colStudy: colStudy,
  colEdit: editColReducer
});

const store = createStore(
  reducers,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

export default store;
