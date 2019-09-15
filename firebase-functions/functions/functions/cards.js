const { db } = require("../util/admin");

exports.getDeckCards = (req, res) => {
  db.collection("decks")
    .doc(`${req.params.deckId}`)
    .get()
    .then(doc => {
      res.status(200).json(doc.data().cardArray);
    })
    .catch(error => console.error(error));
};
