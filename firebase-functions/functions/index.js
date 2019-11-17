const functions = require("firebase-functions");

// Express
const express = require("express");
const app = express();

const authMiddleware = require("./util/authMiddleware");

// Cors
const cors = require("cors");
app.use(cors());

const {
  signup,
  login,
  updateUserProfile,
  resetPassword,
  getUserPersonalData,
  setUserPersonalData
} = require("./functions/user");

const {
  createDeck,
  updateDeck,
  deleteDeck,
  pinDeck,
  unpinDeck,
  getUserDecks,
  getPinnedDecks,
  getDeck,
  uploadDeckImage
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
app.post("/resetPassword", authMiddleware, resetPassword);
app.get("/getUserPersonalData", authMiddleware, getUserPersonalData);
app.post("/setUserPersonalData", authMiddleware, setUserPersonalData);

// DECK ROUTES
// Deck Editing
app.post("/createDeck", authMiddleware, createDeck);
app.post("/updateDeck", updateDeck);
app.post("/deleteDeck", authMiddleware, deleteDeck);
app.post("/uploadDeckImage/:deckId", authMiddleware, uploadDeckImage);
// Deck Pinning
app.post("/pinDeck/:deckId", authMiddleware, pinDeck);
app.post("/unpinDeck/:deckId", authMiddleware, unpinDeck);
// Deck UI
app.get("/getUserDecks", authMiddleware, getUserDecks);
app.get("/getPinnedDecks", authMiddleware, getPinnedDecks);
app.get("/getDeck/:deckId", authMiddleware, getDeck);

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
