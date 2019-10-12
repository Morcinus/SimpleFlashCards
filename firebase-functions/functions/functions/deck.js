const { db, admin } = require("../util/admin");

//#region Deck Editing
exports.createDeck = (req, res) => {
  console.log("Creating deck");
  const deckData = {
    creatorId: req.user.uid,
    deckName: req.body.deckName,
    cardArray: req.body.deckCards
  };

  db.collection("decks")
    .add(deckData)
    .then(docReference => {
      db.collection("users")
        .doc(req.user.uid)
        .update({
          createdDecks: admin.firestore.FieldValue.arrayUnion(docReference.id)
        });
    })
    .then(() => {
      res.status(200).json();
    })
    .catch(error => console.error(error));
};

exports.updateDeck = (req, res) => {
  const deckData = {
    creatorId: req.body.userId,
    deckName: req.body.deckName,
    cardArray: req.body.cardArray
  };

  db.collection("decks")
    .doc(req.body.deckId)
    .set(deckData)
    .then(() => {
      res.status(200).json();
    })
    .catch(error => console.error(error));
};

exports.deleteDeck = (req, res) => {
  // TO-DO Unpin all users - udelat v transaction!!!

  // OSETRIT ABY MOHL NICIT JEN SVOJE DECKY (ted muze i decky ostatnich kdyz ma id)

  if (req.body.deckId && req.user.uid) {
    db.collection("decks")
      .doc(req.body.deckId)
      .delete()
      .then(() => {
        db.collection("users")
          .doc(req.user.uid)
          .update({
            createdDecks: admin.firestore.FieldValue.arrayRemove(
              req.body.deckId
            )
          });
      })
      .then(() => {
        res.status(200).json();
      })
      .catch(error => console.error(error));
  } else {
    res.status(400).json();
  }
};
//#endregion

//#region Deck Pinning
exports.pinDeck = (req, res) => {
  if (req.body.deckId && req.body.userId) {
    db.collection("users")
      .doc(req.body.userId)
      .update({
        pinnedDecks: admin.firestore.FieldValue.arrayUnion(req.body.deckId)
      })
      .then(() => {
        res.status(200).json();
      })
      .catch(error => res.status(500).json({ error: error.code }));
  } else {
    res.status(400).json();
  }
};

exports.unpinDeck = (req, res) => {
  if (req.body.deckId && req.body.userId) {
    db.collection("users")
      .doc(req.body.userId)
      .update({
        pinnedDecks: admin.firestore.FieldValue.arrayRemove(req.body.deckId)
      })
      .then(() => {
        res.status(200).json();
      })
      .catch(error => res.status(500).json({ error: error.code }));
  } else {
    res.status(400).json();
  }
};
//#endregion
