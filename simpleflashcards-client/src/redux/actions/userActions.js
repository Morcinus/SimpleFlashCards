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
  console.log("Logout!");
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
  dispatch({ type: CLEAR_STATUS });
};

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

const setAuthorizationHeader = token => {
  const FBIDToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIDToken);
  axios.defaults.headers.common["Authorization"] = FBIDToken;
};

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

export const clearUserData = () => dispatch => {
  dispatch({ type: CLEAR_USER_PROFILE });
};
