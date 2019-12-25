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
