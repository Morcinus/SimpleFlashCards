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

const { getDeckCards } = require("./functions/cards");

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

// Api
exports.api = functions.region("europe-west1").https.onRequest(app);
