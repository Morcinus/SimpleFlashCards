import { SET_STUDY_DECK, CLEAR_STUDY_DECK, SET_STATUS_BUSY, SET_STATUS_ERROR, SET_STATUS_SUCCESS } from "../types";
import axios from "axios";

export const getLearnDeck = deckId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getDeckUnknownCards/${deckId}`)
    .then(res => {
      dispatch({ type: SET_STUDY_DECK, payload: res.data });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const getLearnAndReviewDeck = deckId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getCardsToLearnAndReview/${deckId}`)
    .then(res => {
      dispatch({ type: SET_STATUS_SUCCESS });
      dispatch({ type: SET_STUDY_DECK, payload: res.data });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const getReviewDeck = deckId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getCardsToReview/${deckId}`)
    .then(res => {
      dispatch({ type: SET_STATUS_SUCCESS });
      dispatch({ type: SET_STUDY_DECK, payload: res.data });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const pushDeckProgress = (deckId, progressDeck) => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  let exportData = {
    cardArray: progressDeck
  };

  axios
    .post(`/setDeckCardsProgress/${deckId}`, exportData)
    .then(() => {
      dispatch({ type: CLEAR_STUDY_DECK });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const clearStudyDeck = () => dispatch => {
  dispatch({ type: CLEAR_STUDY_DECK });
};
