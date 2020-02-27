const { admin, db } = require("./admin");

/**
 * @module authMiddleware
 * @category util
 * @description Slouží k ověřování uživatele pomocí idTokenu
 * @param {Object} req - HTTP požadavek
 * @param {Object} res - HTTP odpověď na požadavek
 * @param {function} next - Callback funkce
 */

// Zdroj https://youtu.be/Fz1f7NLvcu4
module.exports = (req, res, next) => {
  // Přiřazení ID tokenu
  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    return res.status(403).json({ error: "Unauthorized request!" });
  }

  // Ověření ID Tokenu
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;

      // Najde dokument s daty uživatele v databázi
      return db
        .collection("users")
        .doc(req.user.uid)
        .get();
    })
    .then(doc => {
      // Pokud existuje uživatel v databázi
      if (doc.exists) {
        // Přiřadí uživatelské jméno do req.user.username
        req.user.username = doc.data().username;
        return next();
      } else {
        return res.status(403).json("User not found!");
      }
    })
    .catch(error => {
      console.error("Error while verifying token ", error);
      return res.status(403).json(error);
    });
};
