import { SET_STUDY_COLLECTION, CLEAR_STUDY_COLLECTION, SET_STATUS_BUSY, SET_STATUS_ERROR, SET_STATUS_SUCCESS } from "../types";
import axios from "axios";

export const getColLearnCards = colId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getColUnknownCards/${colId}`)
    .then(res => {
      dispatch({
        type: SET_STUDY_COLLECTION,
        payload: unpackCardsFromArrays(res.data.cardArray)
      });
      dispatch({ type: SET_STATUS_SUCCESS });
      console.log("SUCCESS");
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const getColCardsToLearnAndReview = colId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getColCardsToLearnAndReview/${colId}`)
    .then(res => {
      dispatch({
        type: SET_STUDY_COLLECTION,
        payload: unpackCardsFromArrays(res.data.cardArray)
      });
      dispatch({ type: SET_STATUS_SUCCESS });
      console.log("SUCCESS");
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const getColReviewCards = colId => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });
  axios
    .get(`/getColCardsToReview/${colId}`)
    .then(res => {
      dispatch({
        type: SET_STUDY_COLLECTION,
        payload: unpackCardsFromArrays(res.data.cardArray)
      });
      dispatch({ type: SET_STATUS_SUCCESS });
      console.log("SUCCESS");
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const pushCollectionProgress = colProgressCards => dispatch => {
  dispatch({ type: SET_STATUS_BUSY });

  colProgressCards = groupIntoArrays(colProgressCards);
  let pushData = {
    cardArray: colProgressCards
  };

  axios
    .post(`/setColCardsProgress`, pushData)
    .then(() => {
      dispatch({ type: CLEAR_STUDY_COLLECTION });
      dispatch({ type: SET_STATUS_SUCCESS });
    })
    .catch(err => {
      console.error("Error:", err.response.data.errorCode);
      dispatch({ type: SET_STATUS_ERROR, payload: err.response.data.errorCode });
    });
};

export const clearStudyCollection = () => dispatch => {
  dispatch({ type: CLEAR_STUDY_COLLECTION });
};

// Assigns deckId to each card (="unpacks" the collection object)
function unpackCardsFromArrays(deckArray) {
  let exportDeck = [];
  let deckIds = Object.keys(deckArray);

  for (let i = 0; i < deckIds.length; i++) {
    let deck = deckArray[deckIds[i]];
    deck.forEach(card => {
      card.deckId = deckIds[i];
      exportDeck.push(card);
    });
  }

  return exportDeck;
}

// Groups cards into arrays by their deckId
function groupIntoArrays(cards) {
  let deckArrays = {};
  cards.forEach(card => {
    let deckId = card.deckId;

    // Check if the deckId is in decks already
    if (deckArrays.hasOwnProperty(deckId)) {
      // Push card to the existing deck array
      delete card.deckId;
      deckArrays[deckId].push(card);
    } else {
      // Create a new deck array
      delete card.deckId;
      deckArrays[deckId] = [card];
    }
  });
  return deckArrays;
}
