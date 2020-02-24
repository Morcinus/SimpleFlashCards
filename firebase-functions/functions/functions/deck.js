const { db, admin } = require("../util/admin");
const config = require("../util/firebaseConfig");

const { Storage } = require("@google-cloud/storage");

//#region Deck Editing
const validateDeckData = (deckName, cardArray) => {
  let errors = [];

  // DeckName validation
  if (deckName !== "") {
    let deckNameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!deckName.match(deckNameRegex)) {
      errors.push("createDeck/invalid-deck-name");
    }
  } else {
    errors.push("createDeck/empty-deck-name");
  }

  // DeckCards validation
  if (cardArray.length <= 0) {
    errors.push("createDeck/empty-deck");
  }

  return errors;
};

exports.createDeck = (req, res) => {
  // Validate deck data
  const errorCodes = validateDeckData(req.body.deckName, req.body.deckCards);
  if (errorCodes.length > 0) {
    return res.status(400).json({ errorCodes: errorCodes });
  }

  // Generates custom ID for each card
  let cardArray = [];
  req.body.deckCards.forEach(card => {
    let newCard = card;
    newCard.cardId = newId();
    cardArray.push(newCard);
  });

  // Create deckData
  const deckData = {
    creatorId: req.user.uid,
    deckName: req.body.deckName,
    deckDescription: req.body.deckDescription ? req.body.deckDescription : null,
    cardArray: cardArray,
    private: req.body.private
  };

  // Add deckData to database
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
  // Validate deck data
  const errorCodes = validateDeckData(req.body.deckName, req.body.deckCards);
  if (errorCodes.length > 0) {
    return res.status(400).json({ errorCodes: errorCodes });
  }

  let deckDocRef = db.collection("decks").doc(req.params.deckId);
  let deletedCards = [];

  db.runTransaction(t => {
    return t
      .get(deckDocRef)
      .then(doc => {
        // Authorization check
        let creatorId = doc.data().creatorId;
        if (creatorId !== req.user.uid) {
          // Unauthorized
          return res.status(401).json();
        } else {
          // Generate custom ID for each new card
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

          // Create new docData
          let deckData = {
            deckName: req.body.deckName,
            deckDescription: req.body.deckDescription ? req.body.deckDescription : null,
            cardArray: cardArray,
            private: req.body.private
          };

          // Update deck
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
            if (typeof card !== undefined) {
              newProgressCards.push(card);
            }
          });

          // Save updated array
          t.update(progressDoc.ref, { cardArray: newProgressCards });
        });
      });
  })
    .then(() => {
      res.status(200).json({ successCode: "updateDeck/deck-updated" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
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
  let userDocRef = db.collection("users").doc(req.user.uid);
  let deckDocRef = db.collection("decks").doc(req.params.deckId);
  let authorized;

  db.runTransaction(t => {
    return t
      .get(deckDocRef)
      .then(doc => {
        // Authorization check
        let creatorId = doc.data().creatorId;
        if (creatorId !== req.user.uid) {
          // Unauthorized
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

          // Get all collections with this deck
          return db
            .collection("collections")
            .where("deckArray", "array-contains", req.params.deckId)
            .get();
        }
      })
      .then(querySnapshot => {
        // Remove deck from all collections
        querySnapshot.forEach(colDoc => {
          t.update(colDoc.ref, {
            deckArray: admin.firestore.FieldValue.arrayRemove(req.params.deckId)
          });
        });

        // Get all userDocs with pins
        return db
          .collection("users")
          .where("pinnedDecks", "array-contains", req.params.deckId)
          .get();
      })
      .then(querySnapshot => {
        // Remove all deck pins
        querySnapshot.forEach(userDoc => {
          t.update(userDoc.ref, {
            pinnedDecks: admin.firestore.FieldValue.arrayRemove(req.params.deckId)
          });
        });

        // Get all user deckProgress
        return db
          .collectionGroup("deckProgress")
          .where("deckId", "==", req.params.deckId)
          .get();
      })
      .then(querySnapshot => {
        // Remove all saved deck progress
        querySnapshot.forEach(progressDoc => {
          t.delete(progressDoc.ref);
        });
      });
  })
    .then(() => {
      // Delete deck image
      if (authorized === true) {
        // CHECK IF THE PNG/JPG FILE EXISTS AND DELETE IT
        const storage = new Storage();
        const bucket = storage.bucket(config.storageBucket);
        const pngFile = bucket.file(`${req.params.deckId}.png`);
        const jpgFile = bucket.file(`${req.params.deckId}.jpg`);

        // Find .PNG image
        pngFile.exists().then(data => {
          const exists = data[0];
          if (exists) {
            // Delete .PNG image
            pngFile.delete();
          } else {
            // Find .JPG image
            jpgFile.exists().then(data => {
              const exists = data[0];
              if (exists) {
                // Delete .JPG image
                jpgFile.delete();
              }
            });
          }
        });
      }
    })
    .then(() => {
      res.status(200).json({ successCode: "updateDeck/deck-deleted" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
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
      .catch(error => res.status(500).json({ errorCode: error.code }));
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
      .catch(error => res.status(500).json({ errorCode: error.code }));
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
        if (userDecks.length > 0) {
          res.status(200).json(userDecks);
        } else {
          res.status(404).json({ errorCode: "deck/no-deck-found" });
        }
      })
      .catch(error => res.status(500).json({ errorCode: error.code }));
  } else {
    res.status(401).json();
  }
};

exports.getPinnedDecks = (req, res) => {
  if (req.user.uid) {
    let exportDecks = [];

    db.collection("users")
      .doc(req.user.uid)
      .get()
      .then(doc => {
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

        // Wait for the forEach loop to finish
        return Promise.all(promises);
      })
      .then(() => {
        if (exportDecks.length > 0) {
          res.status(200).json(exportDecks);
        } else {
          res.status(404).json({ errorCode: "deck/no-deck-found" });
        }
      })
      .catch(error => res.status(500).json({ errorCode: error.code }));
  } else {
    res.status(401).json();
  }
};

// Gets everything in deck doc
exports.getDeck = (req, res) => {
  db.collection("decks")
    .doc(`${req.params.deckId}`)
    .get()
    .then(deckDoc => {
      if (deckDoc.exists) {
        let deck = deckDoc.data();

        // Authorization check
        let creatorId = deck.creatorId;
        if (deck.private === true && creatorId !== req.user.uid) {
          // Unauthorized
          return res.status(403).json();
        } else {
          // Find the creator username
          return db
            .collection("users")
            .doc(deck.creatorId)
            .get()
            .then(userDoc => {
              deck.creatorName = userDoc.data().username;
              return deck;
            });
        }
      } else {
        return res.status(404).json({ errorCode: "deck/deck-not-found" });
      }
    })
    .then(deck => {
      // Checks whether the deck is pinned
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
        });
    })
    .then(deck => {
      res.status(200).json({ deck });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};
//#endregion
