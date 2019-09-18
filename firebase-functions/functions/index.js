const functions = require("firebase-functions");

// Express
const express = require("express");
const app = express();

const { signup, login, updateUserProfile } = require("./functions/user");

const {
  createDeck,
  updateDeck,
  deleteDeck,
  pinDeck,
  unpinDeck
} = require("./functions/deck");

const {
  getDeckCards,
  setDeckCardsProgress,
  getCardsToReview,
  getDeckUnknownCards
} = require("./functions/cards");

// User routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/updateUserProfile", updateUserProfile);

// Deck routes
app.post("/createDeck", createDeck);
app.post("/updateDeck", updateDeck);
app.post("/deleteDeck", deleteDeck);
app.post("/pinDeck", pinDeck);
app.post("/unpinDeck", unpinDeck);

// Card routes
app.get("/getDeckCards/:deckId", getDeckCards);
app.get("/getCardsToReview/:userId/:deckId", getCardsToReview);
app.get("/getDeckUnknownCards/:userId/:deckId", getDeckUnknownCards);
app.post("/setDeckCardsProgress", setDeckCardsProgress);

// Api
exports.api = functions.region("europe-west1").https.onRequest(app);
