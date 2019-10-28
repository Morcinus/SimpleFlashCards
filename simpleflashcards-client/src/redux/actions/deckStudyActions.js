import { SET_STUDY_DECK, CLEAR_STUDY_DECK } from "../types";
import axios from "axios";

export const uploadDeckProgress = (userData, history) => dispatch => {};

export const getLearnDeck = (userData, history) => dispatch => {};

export const getLearnAndReviewDeck = deckId => dispatch => {
  axios
    .get(`/getCardsToLearnAndReview/${deckId}`)
    .then(res => {
      console.log(res.data);
      dispatch({ type: SET_STUDY_DECK, payload: res.data });
    })
    .catch(err => console.log(err));
};

export const getReviewDeck = (userData, history) => dispatch => {};

export const pushDeckProgress = (deckId, progressDeck) => dispatch => {
  let pushData = {
    deckId: deckId,
    cardArray: progressDeck
  };

  axios
    .post("/setDeckCardsProgress", pushData)
    .then(() => {
      dispatch({ type: CLEAR_STUDY_DECK });
    })
    .catch(err => {
      console.log(err.response.data);
    });
};

export const clearStudyDeck = () => dispatch => {
  dispatch({ type: CLEAR_STUDY_DECK });
};
