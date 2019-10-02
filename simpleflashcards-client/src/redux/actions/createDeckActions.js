import { UPDATE_DECK_DATA } from "../types";

export const saveDeckDraft = deckData => dispatch => {
  dispatch({ type: UPDATE_DECK_DATA, payload: deckData });
};

export const uploadDeck = deckData => dispatch => {};

export const deleteDeck = deckData => dispatch => {};
