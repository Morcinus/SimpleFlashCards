const { db, admin } = require("../util/admin");

//#region Collection Editing
exports.createCollection = (req, res) => {
  console.log("Creating collection");

  const colData = {
    creatorId: req.user.uid,
    colName: req.body.colName,
    colDescription: req.body.colDescription ? req.body.colDescription : null,
    deckArray: req.body.deckArray
  };

  db.collection("collections")
    .add(colData)
    .then(docReference => {
      db.collection("users")
        .doc(req.user.uid)
        .update({
          createdCollections: admin.firestore.FieldValue.arrayUnion(
            docReference.id
          )
        });

      return docReference.id;
    })
    .then(colId => {
      res.status(200).json({ colId: colId });
    })
    .catch(error => console.error(error));
};

exports.updateCollection = (req, res) => {
  console.log("Updating collection");

  const colData = {
    colName: req.body.colName,
    colDescription: req.body.colDescription ? req.body.colDescription : null,
    deckArray: req.body.deckArray
  };

  db.collection("collections")
    .doc(req.params.colId)
    .update(colData)
    .then(() => {
      res.status(200).json();
    })
    .catch(error => console.error(error));
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
        // Collection update
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
          console.log("CreatorId: ", creatorId);
          console.log("userid: ", req.user.uid);
          return res.status(401).json();
        } else {
          // Collection deletion
          t.delete(colDocRef);

          // Collection deletion in user (creator) doc
          t.update(userDocRef, {
            createdCollections: admin.firestore.FieldValue.arrayRemove(
              req.params.colId
            )
          });

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
            pinnedCollections: admin.firestore.FieldValue.arrayRemove(
              req.params.colId
            )
          });
        });
      });
  })
    .then(() => {
      res.status(200).json();
    })
    .catch(error => console.error(error));
};

//#endregion

//#region Collection Pinning
exports.pinCollection = (req, res) => {
  if (req.params.colId) {
    db.collection("users")
      .doc(req.user.uid)
      .update({
        pinnedCollections: admin.firestore.FieldValue.arrayUnion(
          req.params.colId
        )
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
        pinnedCollections: admin.firestore.FieldValue.arrayRemove(
          req.params.colId
        )
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
        console.log(doc);
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

        return Promise.all(promises); // Waits for the forEach loop to finish
      })
      .then(() => {
        res.status(200).json(exportCollections);
      })
      .catch(error => res.status(500).json({ error: error.code }));
  } else {
    res.status(400).json();
  }
};

// Gets everything in deck doc
// TO-DO POLISH CODE
exports.getCollection = (req, res) => {
  let collection;

  db.collection("collections")
    .doc(req.params.colId)
    .get()
    .then(colDoc => {
      collection = colDoc.data();

      // Find the creator username
      return db
        .collection("users")
        .doc(collection.creatorId)
        .get()
        .then(userDoc => {
          collection.creatorName = userDoc.data().username;
          return collection;
        })
        .catch(err => console.log(err));
    })
    .then(collection => {
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
        })
        .catch(err => console.log(err));
    })
    .then(collection => {
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

      return Promise.all(promises); // Waits for the forEach loop to finish
    })
    .then(() => {
      res.status(200).json({ collection });
    })
    .catch(error => console.error(error));
};
//#endregion
