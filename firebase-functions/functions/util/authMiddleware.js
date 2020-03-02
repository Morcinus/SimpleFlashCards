const { admin, db } = require("./admin");

/**
 * @module authMiddleware
 * @category util
 * @description Slouží k ověřování uživatele pomocí idTokenu.
 * @param {Object} req - HTTP požadavek.
 * @param {Object} res - HTTP odpověď na požadavek.
 * @param {function} next - Callback funkce.
 *
 * @returns {string} Pokud nastala chyba, vrací errový kód.
 */

// Zdroj https://youtu.be/Fz1f7NLvcu4
module.exports = (req, res, next) => {
  // Přiřazení ID tokenu
  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    return res.status(403).json({ errorCode: "user/unauthorized" });
  }

  // Ověření ID Tokenu
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;

      return next();
    })
    .catch(error => {
      console.error("Error while verifying token ", error);
      return res.status(403).json({ errorCode: error.code });
    });
};
