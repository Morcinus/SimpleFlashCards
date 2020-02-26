/**
 * @module theme
 * @category util
 * @description Určuje obecné CSS pro celou aplikaci.
 */

export default {
  palette: {
    primary: {
      main: "#37474f", // main: "#37474f"
      light: "#62727b",
      dark: "#102027",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#7cad3e",
      light: "#aedf6d",
      dark: "#4a6c2f",
      contrastText: "#000000"
    },
    background: {
      paper: "#ffffff", //#cfdfda
      default: "#ffffff"
    },
    error: {
      light: "#ff4d4d",
      main: "#ff1a1a",
      dark: "#e60000",
      contrastText: "#fff"
    }
  },
  shape: {
    borderRadius: 12
  },
  loginAndSignup: {
    form: {
      textAlign: "center"
    },
    image: {
      maxWidth: 50,
      margin: "20px auto 20px auto"
    },
    pageTitle: {
      margin: "10px auto 20px auto"
    },
    textField: {
      margin: "10px auto 20px auto"
    },
    button: {
      marginTop: 20,
      position: "relative"
    },
    customError: {
      color: "red",
      fontSize: "0.8rem"
    },
    progress: {
      position: "absolute"
    }
  }
};
