const functions = require("firebase-functions");

// Express
const express = require("express");
const app = express();

// Api
exports.api = functions.region("europe-west1").https.onRequest(app);
