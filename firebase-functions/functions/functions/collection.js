const { db, admin } = require("../util/admin");

//#region Collection Editing
exports.createCollection = (req, res) => {
  console.log("Creating collection");

  const colData = {
    creatorId: req.user.uid,
    colName: req.body.colName,
    colDescription: req.body.colDescription ? req.body.colDescription : null,
    deckArray: req.body.deckArray,
    private: req.body.private
  };

  db.collection("collections")
    .add(colData)
    .then(docReference => {
      db.collection("users")
        .doc(req.user.uid)
        .update({
          createdCollections: admin.firestore.FieldValue.arrayUnion(docReference.id)
        });

      return docReference.id;
    })
    .then(colId => {
      res.status(200).json({ colId: colId });
    })
    .catch(error => console.error(error));
};

const validateCollectionData = (colName, deckArray) => {
  let errors = [];

  // ColName validation
  if (colName !== "") {
    let colNameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!colName.match(colNameRegex)) {
      errors.push("updateCollection/invalid-collection-name");
    }
  } else {
    errors.push("updateCollection/empty-collection-name");
  }

  // DeckCards validation
  if (deckArray.length <= 0) {
    errors.push("updateCollection/empty-collection");
  }

  return errors;
};

exports.updateCollection = (req, res) => {
  // Validate collection data
  const errorCodes = validateCollectionData(req.body.colName, req.body.deckArray);
  if (errorCodes.length > 0) {
    return res.status(400).json({ errorCodes: errorCodes });
  }

  const colData = {
    colName: req.body.colName,
    colDescription: req.body.colDescription ? req.body.colDescription : null,
    deckArray: req.body.deckArray,
    private: req.body.private
  };

  db.collection("collections")
    .doc(req.params.colId)
    .get()
    .then(doc => {
      // Authorization check
      let creatorId = doc.data().creatorId;
      if (creatorId !== req.user.uid) {
        // Unauthorized
        return res.status(401).json();
      } else {
        // Update collection
        db.collection("collections")
          .doc(req.params.colId)
          .update(colData);
      }
    })
    .then(() => {
      res.status(200).json({ successCode: "updateCollection/collection-updated" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};

exports.addDeckToCollection = (req, res) => {
  console.log("Adding deck to collection");

  db.collection("collections")
    .doc(req.params.colId)
    .get()
    .then(doc => {
      // Authorization check
      let creatorId = doc.data().creatorId;
      if (creatorId !== req.user.uid) {
        console.log("CreatorId: ", creatorId);
        console.log("userid: ", req.user.uid);
        return res.status(401).json();
      } else {
        // Update collection
        db.collection("collections")
          .doc(req.params.colId)
          .update({
            deckArray: admin.firestore.FieldValue.arrayUnion(req.params.deckId)
          });
      }
    })
    .then(() => {
      res.status(200).json();
    })
    .catch(error => console.error(error));
};

exports.deleteCollection = (req, res) => {
  let userDocRef = db.collection("users").doc(req.user.uid);
  let colDocRef = db.collection("collections").doc(req.params.colId);

  db.runTransaction(t => {
    return t
      .get(colDocRef)
      .then(doc => {
        // Authorization check
        let creatorId = doc.data().creatorId;
        if (creatorId !== req.user.uid) {
          // Unauthorized
          return res.status(401).json();
        } else {
          // Collection deletion
          t.delete(colDocRef);

          // Collection deletion in user (creator) doc
          t.update(userDocRef, {
            createdCollections: admin.firestore.FieldValue.arrayRemove(req.params.colId)
          });

          // Get all userDocs with pins
          return db
            .collection("users")
            .where("pinnedCollections", "array-contains", req.params.colId)
            .get();
        }
      })
      .then(querySnapshot => {
        // Remove all deck pins
        querySnapshot.forEach(userDoc => {
          t.update(userDoc.ref, {
            pinnedCollections: admin.firestore.FieldValue.arrayRemove(req.params.colId)
          });
        });
      });
  })
    .then(() => {
      res.status(200).json({ successCode: "updateCollection/collection-deleted" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};

//#endregion

//#region Collection Pinning
exports.pinCollection = (req, res) => {
  if (req.params.colId) {
    db.collection("users")
      .doc(req.user.uid)
      .update({
        pinnedCollections: admin.firestore.FieldValue.arrayUnion(req.params.colId)
      })
      .then(() => {
        res.status(200).json();
      })
      .catch(error => res.status(500).json({ error: error.code }));
  } else {
    res.status(400).json();
  }
};

exports.unpinCollection = (req, res) => {
  if (req.params.colId) {
    db.collection("users")
      .doc(req.user.uid)
      .update({
        pinnedCollections: admin.firestore.FieldValue.arrayRemove(req.params.colId)
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

//#region Collection UI
exports.getUserCollections = (req, res) => {
  if (req.user.uid) {
    db.collection("collections")
      .where("creatorId", "==", req.user.uid)
      .get()
      .then(querySnapshot => {
        let userCollections = [];
        querySnapshot.forEach(doc => {
          colData = {
            colName: doc.data().colName,
            colId: doc.id
          };
          userCollections.push(colData);
        });
        return userCollections;
      })
      .then(userCollections => {
        if (userCollections.length > 0) {
          res.status(200).json(userCollections);
        } else {
          res.status(404).json({ errorCode: "collection/no-collection-found" });
        }
      })
      .catch(error => res.status(500).json({ errorCode: error.code }));
  } else {
    res.status(401).json();
  }
};

exports.getUserCollectionsWithDeckInfo = (req, res) => {
  if (req.user.uid) {
    db.collection("collections")
      .where("creatorId", "==", req.user.uid)
      .get()
      .then(querySnapshot => {
        let userCollections = [];
        querySnapshot.forEach(doc => {
          colData = {
            colName: doc.data().colName,
            colId: doc.id
          };
          colData.containsDeck = doc.data().deckArray.includes(req.params.deckId) ? true : false;
          userCollections.push(colData);
        });
        return userCollections;
      })
      .then(userCollections => {
        res.status(200).json(userCollections);
      })
      .catch(error => res.status(500).json({ error: error.code }));
  } else {
    res.status(400).json();
  }
};

exports.getPinnedCollections = (req, res) => {
  if (req.user.uid) {
    let exportCollections = [];

    db.collection("users")
      .doc(req.user.uid)
      .get()
      .then(doc => {
        let pinnedCollections = doc.data().pinnedCollections;
        let promises = [];

        if (pinnedCollections) {
          pinnedCollections.forEach(colId => {
            promises.push(
              db
                .collection("collections")
                .doc(colId)
                .get()
                .then(doc => {
                  let colData = {
                    colName: doc.data().colName,
                    colId: doc.id
                  };

                  exportCollections.push(colData);
                })
            );
          });
        }

        // Wait for the forEach loop to finish
        return Promise.all(promises);
      })
      .then(() => {
        if (exportCollections.length > 0) {
          res.status(200).json(exportCollections);
        } else {
          res.status(404).json({ errorCode: "collection/no-collection-found" });
        }
      })
      .catch(error => res.status(500).json({ errorCode: error.code }));
  } else {
    res.status(401).json();
  }
};

// Gets everything in deck doc
exports.getCollection = (req, res) => {
  let collection;

  db.collection("collections")
    .doc(req.params.colId)
    .get()
    .then(colDoc => {
      if (colDoc.exists) {
        collection = colDoc.data();

        // Authorization check
        let creatorId = collection.creatorId;
        if (collection.private === true && creatorId !== req.user.uid) {
          // Unauthorized
          return res.status(403).json();
        } else {
          // Find the creator username
          return db
            .collection("users")
            .doc(collection.creatorId)
            .get()
            .then(userDoc => {
              collection.creatorName = userDoc.data().username;
              return collection;
            });
        }
      } else {
        return res.status(404).json({ errorCode: "collection/collection-not-found" });
      }
    })
    .then(collection => {
      // Checks whether the collection is pinned
      return db
        .collection("users")
        .doc(req.user.uid)
        .get()
        .then(userDoc => {
          let pinnedCollections = userDoc.data().pinnedCollections;

          // Checks if collection is pinned by user
          let isPinned = false;
          if (pinnedCollections) {
            pinnedCollections.forEach(pinnedCollection => {
              if (pinnedCollection === req.params.colId) {
                isPinned = true;
              }
            });
          }
          collection.isPinned = isPinned;

          // Check if the user is the collection creator
          let isCreator = collection.creatorId === req.user.uid ? true : false;
          collection.isCreator = isCreator;

          return collection;
        });
    })
    .then(collection => {
      // Get collection decks data (deckName, deckImage, deckId)
      let deckArray = collection.deckArray;
      let promises = [];

      if (deckArray) {
        let exportDecks = [];
        deckArray.forEach(deckId => {
          promises.push(
            db
              .collection("decks")
              .doc(deckId)
              .get()
              .then(doc => {
                let deckData = {
                  deckName: doc.data().deckName,
                  deckImage: doc.data().deckImage,
                  deckId: doc.id
                };

                exportDecks.push(deckData);
              })
          );
        });
        collection.deckArray = exportDecks;
      }

      // Wait for the forEach loop to finish
      return Promise.all(promises);
    })
    .then(() => {
      res.status(200).json({ collection });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};
//#endregion
