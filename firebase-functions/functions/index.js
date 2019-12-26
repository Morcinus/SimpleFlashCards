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
  setUserPersonalData,
  getUserData
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
  createCollection,
  updateCollection,
  deleteCollection,
  pinCollection,
  unpinCollection,
  getUserCollections,
  getPinnedCollections,
  getCollection
} = require("./functions/collection");

const {
  getDeckCards,
  setDeckCardsProgress,
  getCardsToReview,
  getDeckUnknownCards,
  getCardsToLearnAndReview
} = require("./functions/cards");

const {
  getColCardsToReview,
  getColUnknownCards,
  getColCardsToLearnAndReview,
  setColCardsProgress
} = require("./functions/collectionCards");

// User routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/updateUserProfile", updateUserProfile);
app.post("/resetPassword", authMiddleware, resetPassword);
app.get("/getUserPersonalData", authMiddleware, getUserPersonalData);
app.post("/setUserPersonalData", authMiddleware, setUserPersonalData);
app.get("/getUserData/:username", getUserData);

// DECK ROUTES
// Deck Editing
app.post("/createDeck", authMiddleware, createDeck);
app.post("/updateDeck/:deckId", authMiddleware, updateDeck);
app.post("/deleteDeck/:deckId", authMiddleware, deleteDeck);
app.post("/uploadDeckImage/:deckId", authMiddleware, uploadDeckImage);
// Deck Pinning
app.post("/pinDeck/:deckId", authMiddleware, pinDeck);
app.post("/unpinDeck/:deckId", authMiddleware, unpinDeck);
// Deck UI
app.get("/getUserDecks", authMiddleware, getUserDecks);
app.get("/getPinnedDecks", authMiddleware, getPinnedDecks);
app.get("/getDeck/:deckId", authMiddleware, getDeck);

// COLLECTION ROUTES
// Collection Editing
app.post("/createCollection", authMiddleware, createCollection);
app.post("/updateCollection/:colId", authMiddleware, updateCollection);
app.post("/deleteCollection/:colId", authMiddleware, deleteCollection);
// Collection Pinning
app.post("/pinCollection/:colId", authMiddleware, pinCollection);
app.post("/unpinCollection/:colId", authMiddleware, unpinCollection);
// Deck UI
app.get("/getUserCollections", authMiddleware, getUserCollections);
app.get("/getPinnedCollections", authMiddleware, getPinnedCollections);
app.get("/getCollection/:colId", authMiddleware, getCollection);

// Deck card routes
app.get("/getDeckCards/:deckId", getDeckCards);
app.get("/getCardsToReview/:deckId", authMiddleware, getCardsToReview);
app.get("/getDeckUnknownCards/:deckId", authMiddleware, getDeckUnknownCards);
app.get(
  "/getCardsToLearnAndReview/:deckId",
  authMiddleware,
  getCardsToLearnAndReview
);
app.post("/setDeckCardsProgress/:deckId", authMiddleware, setDeckCardsProgress);

// Collection Card routes
// app.get("/getDeckCards/:colId", getDeckCards);
app.get("/getColCardsToReview/:colId", authMiddleware, getColCardsToReview);
app.get("/getColUnknownCards/:colId", authMiddleware, getColUnknownCards);
app.get(
  "/getColCardsToLearnAndReview/:colId",
  authMiddleware,
  getColCardsToLearnAndReview
);
app.post("/setColCardsProgress", authMiddleware, setColCardsProgress);

// Api
exports.api = functions.region("europe-west1").https.onRequest(app);
