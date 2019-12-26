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
import homePage from "./pages/homePage";
import signup from "./pages/signup";
import login from "./pages/login";
import home from "./pages/home";
import create from "./pages/create";
import deck from "./pages/deck";
import study from "./pages/study";
import settings from "./pages/settings";
import edit from "./pages/edit";
import collection from "./pages/collection";
import userProfile from "./pages/userProfile";
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
            <Route exact path="/" component={homePage} />
            <AuthRoute exact path="/signup" component={signup} />
            <AuthRoute exact path="/login" component={login} />
            <Route exact path="/home" component={home} />
            <Route exact path="/create" component={create} />
            <Route exact path="/edit/:deckId" component={edit} />
            <Route exact path="/deck/:deckId" component={deck} />
            <Route exact path="/study/:deckId" component={study} />
            <Route exact path="/collection/:colId" component={collection} />
            <Route exact path="/settings" component={settings} />
            <Route exact path="/user/:username" component={userProfile} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;
