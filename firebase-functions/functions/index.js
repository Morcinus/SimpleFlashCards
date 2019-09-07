const functions = require("firebase-functions");

// Express
const express = require("express");
const app = express();

const { signup } = require("./functions/user");

// User routes
app.post("/signup", signup);

// Api
exports.api = functions.region("europe-west1").https.onRequest(app);
