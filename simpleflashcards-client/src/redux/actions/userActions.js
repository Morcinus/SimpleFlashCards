import {
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER_DATA,
  CLEAR_USER_DATA,
  SET_SUCCESS,
  CLEAR_SUCCESS,
  SET_ONE_USER_DATA
} from "../types";
import axios from "axios";

// ZDROJ https://www.youtube.com/watch?v=fjWk7cZFxoM&list=PLMhAeHCz8S38ryyeMiBPPUnFAiWnoPvWP&index=18
export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then(res => {
      setAuthorizationHeader(res.data.idToken);
      dispatch({ type: SET_AUTHENTICATED });
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(err => {
      if (err.response) {
        console.log(err.response.data);
        dispatch({ type: SET_ERRORS, payload: err.response.data });
      }
    });
};

export const signupUser = (newUserData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then(res => {
      setAuthorizationHeader(res.data.idToken);
      dispatch({ type: SET_AUTHENTICATED });
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserPersonalData = () => dispatch => {
  axios
    .get("/getUserPersonalData")
    .then(res => {
      dispatch({ type: SET_USER_DATA, payload: res.data });
    })
    .catch(err => console.log(err));
};

export const setUserPersonalData = (userData, history) => dispatch => {
  console.log("SETTING DATA");
  dispatch({ type: LOADING_UI });

  axios
    .post("/setUserPersonalData", userData)
    .then(res => {
      console.log("Success!");
      console.log(res);
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: SET_SUCCESS, payload: res.data });
      if (userData.username || userData.bio) {
        dispatch({ type: SET_ONE_USER_DATA, payload: userData });
      } else if (userData.email) {
        dispatch({ type: SET_UNAUTHENTICATED });
        history.push("/login");
      }
    })
    .catch(error => {
      if (error.response) {
        console.log("Failure!", error.response.data);
        dispatch({ type: CLEAR_SUCCESS });
        dispatch({ type: SET_ERRORS, payload: error.response.data });
      }
    });
};

export const resetPassword = () => dispatch => {
  console.log("RESETTING PASSWORD");
  dispatch({ type: LOADING_UI });

  axios
    .post("/resetPassword")
    .then(res => {
      console.log("Success!");
      console.log(res);
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: SET_SUCCESS, payload: res.data });
    })
    .catch(error => {
      if (error.response) {
        console.log("Failure!", error.response.data);
        dispatch({ type: CLEAR_SUCCESS });
        dispatch({ type: SET_ERRORS, payload: error.response.data });
      }
    });
};

const setAuthorizationHeader = token => {
  const FBIDToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIDToken);
  axios.defaults.headers.common["Authorization"] = FBIDToken;
};
