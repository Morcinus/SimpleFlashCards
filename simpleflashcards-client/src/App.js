import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import jwtDecode from "jwt-decode";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser } from "./redux/actions/userActions";
// Material UI
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
// import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// Components
import Navbar from "./components/Navbar";
import AuthRoute from "./util/AuthRoute";

// Util
import themeFile from "./util/theme";

//Pages
import home from "./pages/home";
import signup from "./pages/signup";
import login from "./pages/login";
import decks from "./pages/decks";
import create from "./pages/create";
import deck from "./pages/deck";
import study from "./pages/study";
//Axios
import axios from "axios";

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL =
  "https://europe-west1-simpleflashcards-4aea0.cloudfunctions.net/api";

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login";
    store.dispatch(logoutUser());
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
          <Switch>
            <Route exact path="/" component={home} />
            <AuthRoute exact path="/signup" component={signup} />
            <AuthRoute exact path="/login" component={login} />
            <Route exact path="/decks" component={decks} />
            <Route exact path="/create" component={create} />
            <Route exact path="/deck/:deckId" component={deck} />
            <Route exact path="/study/:deckId" component={study} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;
