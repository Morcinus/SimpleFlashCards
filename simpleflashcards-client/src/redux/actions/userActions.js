import {
  SET_USER,
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_UNAUTHENTICATED
} from "../types";
import axios from "axios";

// ZDROJ https://www.youtube.com/watch?v=fjWk7cZFxoM&list=PLMhAeHCz8S38ryyeMiBPPUnFAiWnoPvWP&index=18
export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then(res => {
      setAuthorizationHeader(res.data.idToken);
      //dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const signupUser = (newUserData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then(res => {
      setAuthorizationHeader(res.data.idToken);
      //dispatch(getUserData());
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

// NIC NEDELA ZATIM - smazat
export const getUserData = () => dispatch => {
  axios
    .get("/user")
    .then(res => {
      dispatch({ type: SET_USER, payload: res.data });
    })
    .catch(err => console.log(err));
};

const setAuthorizationHeader = token => {
  const FBIDToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIDToken);
  axios.defaults.headers.common["Authorization"] = FBIDToken;
};
