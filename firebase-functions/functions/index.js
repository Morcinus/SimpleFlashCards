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
  unpinDeck,
  getUserDecks,
  getPinnedDecks,
  getDeck
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

// DECK ROUTES
// Deck Editing
app.post("/createDeck", authMiddleware, createDeck);
app.post("/updateDeck", updateDeck);
app.post("/deleteDeck", authMiddleware, deleteDeck);
// Deck Pinning
app.post("/pinDeck", pinDeck);
app.post("/unpinDeck", unpinDeck);
// Deck UI
app.get("/getUserDecks", authMiddleware, getUserDecks);
app.get("/getPinnedDecks", authMiddleware, getPinnedDecks);
app.get("/getDeck/:deckId", getDeck);

// Card routes
app.get("/getDeckCards/:deckId", getDeckCards);
app.get("/getCardsToReview/:deckId", authMiddleware, getCardsToReview);
app.get("/getDeckUnknownCards/:deckId", authMiddleware, getDeckUnknownCards);
app.get(
  "/getCardsToLearnAndReview/:deckId",
  authMiddleware,
  getCardsToLearnAndReview
);
app.post("/setDeckCardsProgress/:deckId", authMiddleware, setDeckCardsProgress);

// Api
exports.api = functions.region("europe-west1").https.onRequest(app);
