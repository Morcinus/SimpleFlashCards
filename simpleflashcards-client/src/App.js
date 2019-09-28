import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";

// Material UI
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
// import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// Components
import Navbar from "./components/Navbar";

// Util
import themeFile from "./util/theme";

//Pages
import home from "./pages/home";
import signup from "./pages/signup";
import login from "./pages/login";

const theme = createMuiTheme(themeFile);

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={home} />
          <Route exact path="/signup" component={signup} />
          <Route exact path="/login" component={login} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
