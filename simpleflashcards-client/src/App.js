import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import jwtDecode from "jwt-decode";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser } from "./redux/actions/userActions";

// Material UI
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";

// Components
import Navbar from "./components/Navbar";
import GlobalErrorAlert from "./components/GlobalErrorAlert";
import AuthRoute from "./util/AuthRoute";
import PrivateRoute from "./util/PrivateRoute";

// Util
import themeFile from "./util/theme";

//Pages
import signup from "./pages/signup";
import login from "./pages/login";
import home from "./pages/home";
import createDeck from "./pages/createDeck";
import deck from "./pages/deck";
import studyDeck from "./pages/studyDeck";
import settings from "./pages/settings";
import editDeck from "./pages/editDeck";
import collection from "./pages/collection";
import studyCollection from "./pages/studyCollection";
import editCollection from "./pages/editCollection";
import userProfile from "./pages/userProfile";

//Axios
import axios from "axios";

const theme = createMuiTheme(themeFile);

// Nastavení API url
axios.defaults.baseURL = "https://europe-west1-simpleflashcards-4aea0.cloudfunctions.net/api";

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
  }
}

function App() {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Navbar />
          <GlobalErrorAlert />
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <AuthRoute exact path="/signup" component={signup} />
            <AuthRoute exact path="/login" component={login} />
            <PrivateRoute exact path="/home" component={home} />
            <PrivateRoute exact path="/createDeck" component={createDeck} />
            <PrivateRoute exact path="/editDeck/:deckId" component={editDeck} />
            <PrivateRoute exact path="/deck/:deckId" component={deck} />
            <PrivateRoute exact path="/studyDeck/:deckId" component={studyDeck} />
            <PrivateRoute exact path="/collection/:colId" component={collection} />
            <PrivateRoute exact path="/studyCollection/:colId" component={studyCollection} />
            <PrivateRoute exact path="/editCollection/:colId" component={editCollection} />
            <PrivateRoute exact path="/settings" component={settings} />
            <PrivateRoute exact path="/user/:username" component={userProfile} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;
