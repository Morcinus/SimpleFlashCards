const functions = require("firebase-functions");

// Express
const express = require("express");
const app = express();

const authMiddleware = require("./util/authMiddleware");

// Cors
const cors = require("cors")({ origin: true });
//const cors = require("cors");
// app.use(cors({ origin: "http://localhost:3000" }));
//app.options("*", cors();
app.use(cors);
app.options("*", cors);
//response.set("Access-Control-Allow-Origin", "*");

const { signup, login, resetPassword, getUserPersonalData, setUserPersonalData, getUserDataByUsername, getUserData } = require("./functions/user");

const { createDeck, updateDeck, deleteDeck, pinDeck, unpinDeck, getUserDecks, getPinnedDecks, getDeck, uploadDeckImage } = require("./functions/deck");

const {
  createCollection,
  updateCollection,
  addDeckToCollection,
  deleteCollection,
  pinCollection,
  unpinCollection,
  getUserCollections,
  getUserCollectionsWithDeckInfo,
  getPinnedCollections,
  getCollection
} = require("./functions/collection");

const { getDeckCards, setDeckCardsProgress, getCardsToReview, getDeckUnknownCards, getCardsToLearnAndReview } = require("./functions/deckCards");

const { getColCardsToReview, getColUnknownCards, getColCardsToLearnAndReview, setColCardsProgress } = require("./functions/collectionCards");

// User routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/resetPassword", authMiddleware, resetPassword);
app.get("/getUserPersonalData", authMiddleware, getUserPersonalData);
app.post("/setUserPersonalData", authMiddleware, setUserPersonalData);
app.get("/getUserDataByUsername/:username", getUserDataByUsername);
app.get("/getUserData", authMiddleware, getUserData);

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
app.post("/addDeckToCollection/:colId/:deckId", authMiddleware, addDeckToCollection);
app.post("/deleteCollection/:colId", authMiddleware, deleteCollection);
// Collection Pinning
app.post("/pinCollection/:colId", authMiddleware, pinCollection);
app.post("/unpinCollection/:colId", authMiddleware, unpinCollection);
// Collection UI
app.get("/getUserCollections", authMiddleware, getUserCollections);
app.get("/getUserCollectionsWithDeckInfo/:deckId", authMiddleware, getUserCollectionsWithDeckInfo);
app.get("/getPinnedCollections", authMiddleware, getPinnedCollections);
app.get("/getCollection/:colId", authMiddleware, getCollection);

// Deck card routes
app.get("/getCardsToReview/:deckId", authMiddleware, getCardsToReview);
app.get("/getDeckUnknownCards/:deckId", authMiddleware, getDeckUnknownCards);
app.get("/getCardsToLearnAndReview/:deckId", authMiddleware, getCardsToLearnAndReview);
app.post("/setDeckCardsProgress/:deckId", authMiddleware, setDeckCardsProgress);

// Collection Card routes
app.get("/getColCardsToReview/:colId", authMiddleware, getColCardsToReview);
app.get("/getColUnknownCards/:colId", authMiddleware, getColUnknownCards);
app.get("/getColCardsToLearnAndReview/:colId", authMiddleware, getColCardsToLearnAndReview);
app.post("/setColCardsProgress", authMiddleware, setColCardsProgress);

// Api
exports.api = functions.region("europe-west1").https.onRequest(app);
