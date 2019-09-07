const functions = require("firebase-functions");

// Express
const express = require("express");
const app = express();

const { signup, login } = require("./functions/user");

// User routes
app.post("/signup", signup);
app.post("/login", login);

// Api
exports.api = functions.region("europe-west1").https.onRequest(app);
