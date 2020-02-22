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
  SET_ONE_USER_DATA,
  SET_USER_PROFILE,
  CLEAR_USER_PROFILE,
  SET_STATUS_BUSY,
  SET_STATUS_ERROR,
  SET_STATUS_SUCCESS,
  CLEAR_STATUS
} from "../types";
import axios from "axios";

export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .post("/login", userData)
    .then(res => {
      setAuthorizationHeader(res.data.idToken);
      dispatch({ type: SET_AUTHENTICATED });
      dispatch({ type: SET_STATUS_SUCCESS });
      history.push("/");
    })
    .catch(err => {
      if (err.response) {
        console.error("Error:", err.response.data.errorCode);
        dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
      }
    });
};

export const signupUser = (newUserData, history) => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .post("/signup", newUserData)
    .then(res => {
      setAuthorizationHeader(res.data.idToken);
      dispatch({ type: SET_AUTHENTICATED });
      dispatch({ type: SET_STATUS_SUCCESS });
      history.push("/");
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

export const getUserDataByUsername = username => dispatch => {
  axios
    .get(`/getUserDataByUsername/${username}`)
    .then(res => {
      dispatch({ type: CLEAR_USER_PROFILE });
      dispatch({ type: SET_USER_PROFILE, payload: res.data });
    })
    .catch(err => console.log(err));
};

export const getUserData = () => dispatch => {
  console.log("Getting user Data");
  axios
    .get("/getUserData")
    .then(res => {
      console.log("Res data", res.data);
      dispatch({ type: CLEAR_USER_PROFILE });
      dispatch({ type: SET_USER_PROFILE, payload: res.data });
      console.log("All saved");
    })
    .catch(err => console.log(err));
};

export const clearUserData = () => dispatch => {
  dispatch({ type: CLEAR_USER_PROFILE });
};
