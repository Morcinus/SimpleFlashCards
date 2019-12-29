import {
  SET_STUDY_COLLECTION,
  CLEAR_STUDY_COLLECTION,
  LOADING_COLLECTION
} from "../types";
import axios from "axios";

export const getColLearnCards = colId => dispatch => {
  console.log("Jsem tu LEARN");
  dispatch({ type: LOADING_COLLECTION });
  axios
    .get(`/getColUnknownCards/${colId}`)
    .then(res => {
      console.log("Learn collection cards: ", res.data);
      dispatch({
        type: SET_STUDY_COLLECTION,
        payload: unpackCardsFromArrays(res.data.cardArray)
      });
    })
    .catch(err => console.log(err));
};

export const getColCardsToLearnAndReview = colId => dispatch => {
  console.log("Jsem tu LEARN&REVIEW");
  dispatch({ type: LOADING_COLLECTION });
  axios
    .get(`/getColCardsToLearnAndReview/${colId}`)
    .then(res => {
      console.log("Study cards: ", res.data);
      dispatch({
        type: SET_STUDY_COLLECTION,
        payload: unpackCardsFromArrays(res.data.cardArray)
      });
    })
    .catch(err => console.log(err));
};

export const getColReviewCards = colId => dispatch => {
  console.log("Jsem tu REVIEW");
  dispatch({ type: LOADING_COLLECTION });
  axios
    .get(`/getColCardsToReview/${colId}`)
    .then(res => {
      console.log("Review cards: ", res.data);
      dispatch({
        type: SET_STUDY_COLLECTION,
        payload: unpackCardsFromArrays(res.data.cardArray)
      });
    })
    .catch(err => console.log(err));
};

export const pushCollectionProgress = colProgressCards => dispatch => {
  colProgressCards = groupIntoArrays(colProgressCards);
  let pushData = {
    cardArray: colProgressCards
  };

  console.log("Pushing progress:", pushData);

  axios
    .post(`/setColCardsProgress`, pushData)
    .then(() => {
      dispatch({ type: CLEAR_STUDY_COLLECTION });
    })
    .catch(err => {
      console.log(err.response.data);
    });
};

export const clearStudyCollection = () => dispatch => {
  dispatch({ type: CLEAR_STUDY_COLLECTION });
};

// Assigns deckId to each card (="unpacks" the collection object)
function unpackCardsFromArrays(deckArray) {
  console.log(deckArray);
  let exportDeck = [];
  let deckIds = Object.keys(deckArray);

  for (let i = 0; i < deckIds.length; i++) {
    let deck = deckArray[deckIds[i]];
    console.log("deck:", deck);
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

    // Check if the deckId is in the array already
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
