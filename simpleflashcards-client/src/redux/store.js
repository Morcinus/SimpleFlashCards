import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

// Reducers
import userReducer from "./reducers/userReducer";
import uiReducer from "./reducers/uiReducer";
import createDeckReducer from "./reducers/createDeckReducer";
import deckUi from "./reducers/deckUiReducer";
import deckStudy from "./reducers/deckStudyReducer";

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
  user: userReducer,
  UI: uiReducer,
  deckCreation: createDeckReducer,
  deckUi: deckUi,
  deckStudy: deckStudy
});

const store = createStore(
  reducers,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
