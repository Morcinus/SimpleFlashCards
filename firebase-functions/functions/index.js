const functions = require("firebase-functions");

// Express
const express = require("express");
const app = express();

const authMiddleware = require("./util/authMiddleware");

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
  getDeckUnknownCards,
  getCardsToLearnAndReview
} = require("./functions/cards");

// User routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/updateUserProfile", updateUserProfile);

// Deck routes
app.post("/createDeck", authMiddleware, createDeck);
app.post("/updateDeck", updateDeck);
app.post("/deleteDeck", authMiddleware, deleteDeck);
app.post("/pinDeck", pinDeck);
app.post("/unpinDeck", unpinDeck);

// Card routes
app.get("/getDeckCards/:deckId", getDeckCards);
app.get("/getCardsToReview/:userId/:deckId", getCardsToReview);
app.get("/getDeckUnknownCards/:userId/:deckId", getDeckUnknownCards);
app.get("/getCardsToLearnAndReview/:userId/:deckId", getCardsToLearnAndReview);
app.post("/setDeckCardsProgress", setDeckCardsProgress);

// Api
exports.api = functions.region("europe-west1").https.onRequest(app);
