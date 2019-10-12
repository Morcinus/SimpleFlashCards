const { admin, db } = require("./admin");

// Zdroj https://youtu.be/Fz1f7NLvcu4
// NEEDS BETTER ERROR HANDLING
module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized request!" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      console.log(decodedToken);
      return db
        .collection("users")
        .doc(req.user.uid)
        .get();
    })
    .then(doc => {
      if (doc.exists) {
        req.user.username = doc.data().username;
        return next();
      } else {
        console.error("User not found!");
        return res.status(403).json("User not found!");
      }
    })
    .catch(error => {
      console.error("Error while verifying token ", error);
      return res.status(403).json(error);
    });
};
