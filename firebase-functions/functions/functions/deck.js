const { db, admin } = require("../util/admin");
const config = require("../util/firebaseConfig");

const { Storage } = require("@google-cloud/storage");

//#region Deck Editing
const validateDeckData = deckData => {
  let errors = [];

  // DeckName validation
  if (deckData.deckName !== "") {
    let deckNameRegex = /^[a-zA-Z0-9]+$/;
    if (!deckData.deckName.match(deckNameRegex)) {
      errors.push("createDeck/invalid-deck-name");
    }
  } else {
    errors.push("createDeck/empty-deck-name");
  }

  // DeckCards validation
  if (deckData.cardArray.length <= 0) {
    errors.push("createDeck/empty-deck");
  }

  return errors;
};

exports.createDeck = (req, res) => {
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
    cardArray: cardArray,
    private: req.body.private
  };

  // Validate deck data
  const errorCodes = validateDeckData(deckData);
  if (errorCodes.length > 0) {
    return res.status(400).json({ errorCodes: errorCodes });
  }

  // Create deck
  db.collection("decks")
    .add(deckData)
    .then(docReference => {
      db.collection("users")
        .doc(req.user.uid)
        .update({
          createdDecks: admin.firestore.FieldValue.arrayUnion(docReference.id)
        });

      return docReference.id;
    })
    .then(deckId => {
      res.status(200).json({ deckId: deckId });
    })
    .catch(err => {
      return res.status(500).json({ errorCode: err.code });
    });
};

exports.updateDeck = (req, res) => {
  console.log("Updating deck");

  let deckDocRef = db.collection("decks").doc(req.params.deckId);
  let deletedCards = [];

  db.runTransaction(t => {
    return t
      .get(deckDocRef)
      .then(doc => {
        // Authorization check
        let creatorId = doc.data().creatorId;
        if (creatorId !== req.user.uid) {
          console.log("CreatorId: ", creatorId);
          console.log("userid: ", req.user.uid);
          authorized = false;
          return res.status(401).json();
        } else {
          authorized = true;

          // Generates custom ID for each new card
          let cardArray = [];
          req.body.deckCards.forEach(card => {
            if (!card.cardId) {
              let newCard = card;
              newCard.cardId = newId();
              cardArray.push(newCard);
            } else {
              cardArray.push(card);
            }
          });

          // Creates new docData
          let deckData = {
            deckName: req.body.deckName,
            deckDescription: req.body.deckDescription ? req.body.deckDescription : null,
            cardArray: cardArray,
            private: req.body.private
          };

          // Updates deck
          t.update(deckDocRef, deckData);

          // Find deleted cards
          let oldCardArray = doc.data().cardArray;
          let newCardArray = req.body.deckCards;
          deletedCards = findDeletedCards(oldCardArray, newCardArray);

          // Find all user deck progress
          return db
            .collectionGroup("deckProgress")
            .where("deckId", "==", req.params.deckId)
            .get();
        }
      })
      .then(querySnapshot => {
        // Remove all deleted cards in user progess
        querySnapshot.forEach(progressDoc => {
          let progressCards = progressDoc.data().cardArray;

          // Remove deleted cards from progressCard array
          deletedCards.forEach(deletedCard => {
            for (let i = 0; i < progressCards.length; i++) {
              // If the card is not already deleted
              if (progressCards[i])
                if (progressCards[i].cardId === deletedCard.cardId) {
                  delete progressCards[i];
                }
            }
          });

          // Push the remaining cards
          let newProgressCards = [];
          progressCards.forEach(card => {
            // If the card was not deleted
            if (card !== undefined) {
              newProgressCards.push(card);
            }
          });

          // Save updated array
          t.update(progressDoc.ref, { cardArray: newProgressCards });
        });
      });
  })
    .then(() => {
      res.status(200).json();
    })
    .catch(error => console.error(error));
};

// Finds which cards from firstArray are not in the secondArray (=which cards were deleted)
function findDeletedCards(firstArray, secondArray) {
  let newArray = firstArray.filter(function checkInSecondArray(card1) {
    // Search for card1 in the secondArray
    let foundCard = secondArray.find(function isWantedCard(card2) {
      return card1.cardId === card2.cardId;
    });

    return foundCard ? false : true;
  });

  return newArray;
}

exports.deleteDeck = (req, res) => {
  // TO-DO Unpin all users - udelat v transaction!!!

  let userDocRef = db.collection("users").doc(req.user.uid);
  let deckDocRef = db.collection("decks").doc(req.params.deckId);
  let pinsRefs = db.collection("users").where("pinnedDecks", "array-contains", req.params.deckId);
  let authorized;

  db.runTransaction(t => {
    return t
      .get(deckDocRef)
      .then(doc => {
        // Authorization check
        let creatorId = doc.data().creatorId;
        if (creatorId !== req.user.uid) {
          console.log("CreatorId: ", creatorId);
          console.log("userid: ", req.user.uid);
          authorized = false;
          return res.status(401).json();
        } else {
          authorized = true;
          // Deck deletion
          t.delete(deckDocRef);

          // Deck deletion in user (creator) doc
          t.update(userDocRef, {
            createdDecks: admin.firestore.FieldValue.arrayRemove(req.params.deckId)
          });

          return db
            .collection("users")
            .where("pinnedDecks", "array-contains", req.params.deckId)
            .get();
        }
      })
      .then(querySnapshot => {
        // Remove all deck pins
        querySnapshot.forEach(userDoc => {
          t.update(userDoc.ref, {
            pinnedDecks: admin.firestore.FieldValue.arrayRemove(req.params.deckId)
          });
        });

        return db
          .collectionGroup("deckProgress")
          .where("deckId", "==", req.params.deckId)
          .get();
      })
      .then(querySnapshot => {
        // Remove all saved deck progress
        querySnapshot.forEach(progressDoc => {
          console.log("Deleting ", progressDoc.id);
          t.delete(progressDoc.ref);
        });
      });
  })
    .then(() => {
      // Deck image deletion
      if (authorized === true) {
        // CHECK IF THE PNG/JPG FILE EXISTS AND DELETE IT
        const storage = new Storage();
        const bucket = storage.bucket(config.storageBucket);
        const pngFile = bucket.file(`${req.params.deckId}.png`);
        const jpgFile = bucket.file(`${req.params.deckId}.jpg`);

        pngFile.exists().then(data => {
          const exists = data[0];
          if (exists) {
            console.log("DELETING PNG");
            pngFile.delete();
          } else {
            console.log("PNG DOES NOT EXIST");
            jpgFile.exists().then(data => {
              const exists = data[0];
              if (exists) {
                console.log("DELETING JPG");
                jpgFile.delete();
              } else {
                console.log("FILE DOES NOT EXIST");
              }
            });
          }
        });
      }
    })
    .then(() => {
      res.status(200).json();
    })
    .catch(error => console.error(error));
};

function newId() {
  // Alphanumeric characters
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let autoId = "";
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return autoId;
}

// ZDROJ: https://youtu.be/ecgAwgHXYos
exports.uploadDeckImage = (req, res) => {
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
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${req.params.deckId}.${imageExtension}`;
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

        return db.doc(`/decks/${req.params.deckId}`).update({ deckImage: imageUrl });
      })
      .then(() => {
        return res.status(200).json({ successCode: "createDeck/image-uploaded" });
      })
      .catch(err => {
        return res.status(500).json({ errorCode: err.code });
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

      let creatorId = deck.creatorId;
      if (deck.private === true && creatorId !== req.user.uid) {
        console.log("CreatorId: ", creatorId);
        console.log("userid: ", req.user.uid);
        authorized = false;
        return res.status(403).json();
      } else {
        return db
          .collection("users")
          .doc(deck.creatorId)
          .get()
          .then(userDoc => {
            deck.creatorName = userDoc.data().username;
            return deck;
          })
          .catch(err => console.log(err));
      }
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
