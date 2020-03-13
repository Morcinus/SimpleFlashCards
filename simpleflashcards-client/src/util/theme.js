/**
 * @module theme
 * @category util
 * @description Určuje CSS aplikace.
 *
 * @property {Object} palette - Paleta barev pro [Material UI]{@link https://material-ui.com/customization/palette/}.
 * @property {Object} shape.borderRadius - Určuje zaoblení rohů elementů.
 * @property {Object} loginAndSignup - Určuje CSS pro stránky [login]{@link login} a [signup]{@link signup}.
 */

export default {
  palette: {
    primary: {
      main: "#37474f",
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
    },
    success: {
      light: "#81c784",
      main: "#4caf50",
      dark: "#388e3c"
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
