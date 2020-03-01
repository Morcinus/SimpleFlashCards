/**
 * @module admin
 * @category util
 * @requires {@link https://www.npmjs.com/package/firebase-admin}
 */

const admin = require("firebase-admin");

// Spuštění SDK
admin.initializeApp();

/**
 * @const db
 * @description Firestore Databáze
 */
const db = admin.firestore();

module.exports = { admin, db };
