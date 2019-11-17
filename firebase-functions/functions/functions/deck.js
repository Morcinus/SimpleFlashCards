const { db, admin } = require("../util/admin");
const config = require("../util/firebaseConfig");

//#region Deck Editing
exports.createDeck = (req, res) => {
  console.log("Creating deck");

  // Generates custom ID for each card
  let cardArray = [];
  req.body.deckCards.forEach(card => {
    let newCard = card;
    newCard.cardId = newId();
    cardArray.push(newCard);
  });

  const deckData = {
    creatorId: req.user.uid,
    deckName: req.body.deckName,
    deckDescription: req.body.deckDescription ? req.body.deckDescription : null,
    cardArray: cardArray
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

// NEEDS UPDATE
exports.updateDeck = (req, res) => {
  const deckData = {
    creatorId: req.body.userId,
    deckName: req.body.deckName,
    deckDescription: req.body.deckDescription ? req.body.deckDescription : null,
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

function newId() {
  // Alphanumeric characters
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let autoId = "";
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return autoId;
}

// ZDROJ: https://youtu.be/ecgAwgHXYos
exports.uploadDeckImage = (req, res) => {
  console.log(req.params.deckId);

  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    // 32756238461724837.png
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;

        return db
          .doc(`/decks/${req.params.deckId}`)
          .update({ deckImage: imageUrl });
      })
      .then(() => {
        return res.status(200).json({ message: "image uploaded successfully" });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};

//#endregion

//#region Deck Pinning
exports.pinDeck = (req, res) => {
  if (req.params.deckId) {
    db.collection("users")
      .doc(req.user.uid)
      .update({
        pinnedDecks: admin.firestore.FieldValue.arrayUnion(req.params.deckId)
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
  if (req.params.deckId) {
    db.collection("users")
      .doc(req.user.uid)
      .update({
        pinnedDecks: admin.firestore.FieldValue.arrayRemove(req.params.deckId)
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

//#region Deck UI
exports.getUserDecks = (req, res) => {
  if (req.user.uid) {
    db.collection("decks")
      .where("creatorId", "==", req.user.uid)
      .get()
      .then(querySnapshot => {
        let userDecks = [];
        querySnapshot.forEach(doc => {
          exportDeck = {
            deckName: doc.data().deckName,
            deckImage: doc.data().deckImage,
            deckId: doc.id
          };
          userDecks.push(exportDeck);
        });
        return userDecks;
      })
      .then(userDecks => {
        res.status(200).json(userDecks);
      })
      .catch(error => res.status(500).json({ error: error.code }));
  } else {
    res.status(400).json();
  }
};

exports.getPinnedDecks = (req, res) => {
  if (req.user.uid) {
    let exportDecks = [];

    db.collection("users")
      .doc(req.user.uid)
      .get()
      .then(doc => {
        console.log(doc);
        let pinnedDecks = doc.data().pinnedDecks;
        let promises = [];

        if (pinnedDecks) {
          pinnedDecks.forEach(deckId => {
            promises.push(
              db
                .collection("decks")
                .doc(deckId)
                .get()
                .then(doc => {
                  let exportDeck = {
                    deckName: doc.data().deckName,
                    deckImage: doc.data().deckImage,
                    deckId: doc.id
                  };

                  exportDecks.push(exportDeck);
                })
            );
          });
        }

        return Promise.all(promises); // Waits for the forEach loop to finish
      })
      .then(() => {
        res.status(200).json(exportDecks);
      })
      .catch(error => res.status(500).json({ error: error.code }));
  } else {
    res.status(400).json();
  }
};

// Gets everything in deck doc
exports.getDeck = (req, res) => {
  db.collection("decks")
    .doc(`${req.params.deckId}`)
    .get()
    .then(deckDoc => {
      let deck = deckDoc.data();

      return db
        .collection("users")
        .doc(deck.creatorId)
        .get()
        .then(userDoc => {
          deck.creatorName = userDoc.data().username;
          return deck;
        })
        .catch(err => console.log(err));
    })
    .then(deck => {
      return db
        .collection("users")
        .doc(req.user.uid)
        .get()
        .then(userDoc => {
          let pinnedDecks = userDoc.data().pinnedDecks;

          // Checks if deck is pinned by user
          let isPinned = false;
          if (pinnedDecks) {
            pinnedDecks.forEach(pinnedDeck => {
              if (pinnedDeck === req.params.deckId) {
                isPinned = true;
              }
            });
          }
          deck.isPinned = isPinned;

          // Check if the user is the deck creator
          let isCreator = deck.creatorId === req.user.uid ? true : false;
          deck.isCreator = isCreator;

          return deck;
        })
        .catch(err => console.log(err));
    })
    .then(deck => {
      res.status(200).json({ deck });
    })
    .catch(error => console.error(error));
};
//#endregion
