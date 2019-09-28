import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import jwtDecode from "jwt-decode";

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

const theme = createMuiTheme(themeFile);

let authenticated;
const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login";
    authenticated = false;
  } else {
    authenticated = true;
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={home} />
          <AuthRoute
            exact
            path="/signup"
            component={signup}
            authenticated={authenticated}
          />
          <AuthRoute
            exact
            path="/login"
            component={login}
            authenticated={authenticated}
          />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
