import {
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER_DATA,
  SET_ONE_USER_DATA,
  SET_USER_PROFILE,
  CLEAR_USER_PROFILE,
  SET_STATUS_BUSY,
  SET_STATUS_ERROR,
  SET_STATUS_SUCCESS,
  CLEAR_STATUS
} from "../types";
import axios from "axios";

/**
 * @category ReduxActions
 * @module userActions
 * @description Zde jsou funkce, které komunikují se serverem ohledně dat uživatele a vyvolávají změny v [userReduceru]{@link module:userReducer} a [uiStatusReduceru]{@link module:uiStatusReducer}.
 */

/**
 * @function loginUser
 * @description Přihlásí uživatele. Tím také získá od serveru idToken, který uloží do localStorage. Také nastaví hodnotu authenticated v [userReduceru]{@link module:userReducer}.
 * @param {Object} userData - Přihlašovací údaje uživatele.
 * @param {Object} history - Historie prohlížeče, slouží k přesměrování na /home.
 * @async
 */
export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .post("/login", userData)
    .then(res => {
      setAuthorizationHeader(res.data.idToken);
      dispatch({ type: SET_AUTHENTICATED });
      dispatch({ type: SET_STATUS_SUCCESS });
      history.push("/home");
    })
    .catch(err => {
      if (err.response) {
        console.error("Error:", err.response.data.errorCode);
        dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
      }
    });
};

/**
 * @function signupUser
 * @description Zaregistruje uživatele. Tím také získá od serveru idToken, který uloží do localStorage. Také nastaví hodnotu authenticated v [userReduceru]{@link module:userReducer}.
 * @param {Object} newUserData - Registrační údaje uživatele.
 * @param {Object} history - Historie prohlížeče, slouží k přesměrování na /home.
 * @async
 */
export const signupUser = (newUserData, history) => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .post("/signup", newUserData)
    .then(res => {
      setAuthorizationHeader(res.data.idToken);
      dispatch({ type: SET_AUTHENTICATED });
      dispatch({ type: SET_STATUS_SUCCESS });
      history.push("/home");
    })
    .catch(err => {
      if (err.response.data.errorCodes) {
        err.response.data.errorCodes.forEach(errorCode => {
          console.error("Error:", errorCode);
          dispatch({ type: SET_STATUS_ERROR, payload: errorCode });
        });
      } else {
        console.error("Error:", err.response.data.errorCode);
        dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
      }
    });
};

/**
 * @function logoutUser
 * @description Odhlásí uživatele a vymaže idToken.
 */
export const logoutUser = () => dispatch => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
  dispatch({ type: CLEAR_STATUS });
};

/**
 * @function getUserPersonalData
 * @description Získá ze serveru osobní data uživatele a uloží je do [userReduceru]{@link module:userReducer}.
 * @async
 */
export const getUserPersonalData = () => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get("/getUserPersonalData")
    .then(res => {
      dispatch({ type: SET_USER_DATA, payload: res.data });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

/**
 * @function setUserPersonalData
 * @description Odešle na server požadavek o přenastavení osobních dat uživatele.
 * @param {Object} userData - Osobní údaje uživatele.
 * @param {Object} history - Historie prohlížeče, slouží k přesměrování na /login.
 * @async
 */
export const setUserPersonalData = (userData, history) => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });

  axios
    .post("/setUserPersonalData", userData)
    .then(res => {
      console.log("Success!");
      dispatch({ type: SET_STATUS_SUCCESS, payload: res.data.successCode });
      if (userData.username || userData.bio) {
        dispatch({ type: SET_ONE_USER_DATA, payload: userData });
      } else if (userData.email) {
        dispatch(logoutUser());
        history.push("/login");
      }
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

/**
 * @function resetPassword
 * @description Odešle na server požadavek o změnu uživatelského hesla.
 * @async
 */
export const resetPassword = () => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });

  axios
    .post("/resetPassword")
    .then(res => {
      dispatch({ type: SET_STATUS_SUCCESS, payload: res.data.successCode });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

/**
 * @function setAuthorizationHeader
 * @description Uloží idToken do localStorage a nastaví ho jako Authorization header pro HTTP požadavky.
 * @param {string} token - IdToken daného uživatele.
 */
const setAuthorizationHeader = token => {
  const FBIDToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIDToken);
  axios.defaults.headers.common["Authorization"] = FBIDToken;
};

/**
 * @function getUserDataByUsername
 * @description Získá ze serveru data o uživateli na základě jeho uživatelského jména a uloží je do [userReduceru]{@link module:userReducer}. Tato funkce se používá při přistupování na cizí uživatelské profily.
 * @param {string} username - Jméno uživatele, o kterém aplikace získává informace.
 * @async
 */
export const getUserDataByUsername = username => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getUserDataByUsername/${username}`)
    .then(res => {
      dispatch({ type: SET_USER_PROFILE, payload: res.data });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

/**
 * @function getUserData
 * @description Získá ze serveru data o přihlášeném uživateli a uloží je do [userReduceru]{@link module:userReducer}. Tato funkce se používá při přistupování vlastní profil přihlášeného uživatele.
 * @async
 */
export const getUserData = () => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get("/getUserData")
    .then(res => {
      dispatch({ type: SET_USER_PROFILE, payload: res.data });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

/**
 * @function clearUserData
 * @description Vymaže z [userReduceru]{@link module:userReducer} data o profilu uživatele.
 */
export const clearUserData = () => dispatch => {
  dispatch({ type: CLEAR_USER_PROFILE });
};
