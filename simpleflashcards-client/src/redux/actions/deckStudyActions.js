import { SET_STUDY_DECK, CLEAR_STUDY_DECK } from "../types";
import axios from "axios";

export const getLearnDeck = deckId => dispatch => {
  axios
    .get(`/getDeckUnknownCards/${deckId}`)
    .then(res => {
      console.log("Learn cards: ", res.data);
      dispatch({ type: SET_STUDY_DECK, payload: res.data });
    })
    .catch(err => console.log(err));
};

export const getLearnAndReviewDeck = deckId => dispatch => {
  axios
    .get(`/getCardsToLearnAndReview/${deckId}`)
    .then(res => {
      console.log("Study cards: ", res.data);
      dispatch({ type: SET_STUDY_DECK, payload: res.data });
    })
    .catch(err => console.log(err));
};

export const getReviewDeck = deckId => dispatch => {
  axios
    .get(`/getCardsToReview/${deckId}`)
    .then(res => {
      console.log("Review cards: ", res.data);
      dispatch({ type: SET_STUDY_DECK, payload: res.data });
    })
    .catch(err => console.log(err));
};

export const pushDeckProgress = (deckId, progressDeck) => dispatch => {
  // This can be polished
  let pushData = {
    cardArray: progressDeck
  };

  console.log(progressDeck);

  axios
    .post(`/setDeckCardsProgress/${deckId}`, pushData)
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
