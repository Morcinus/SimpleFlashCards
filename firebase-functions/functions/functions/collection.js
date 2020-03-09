const { db, admin } = require("../util/admin");
const { DECK_COL_NAME_REGEX_STRING } = require("../util/other");

/**
 * @module collection
 * @category Funkce
 * @description Zde jsou funkce, které se starají o data kolekcí.
 */

//#region Collection Editing
/**
 * @function validateCreateCollectionData
 * @description Ověří, zda-li obsahuje název kolekce pouze povolené znaky a zda-li je v kolekci alespoň 1 balíček.
 * @param {string} colName - Název kolekce.
 * @param {Array<Object>} deckArray - Pole balíčků.
 * @returns {Array<String>} Vrací pole error kódů. Pokud ověření proběhlo bez problému, vrací prázdné pole.
 */
const validateCreateCollectionData = (colName, deckArray) => {
  let errors = [];

  // Ověření názvu kolekce.
  if (colName !== "") {
    if (!colName.match(new RegExp(DECK_COL_NAME_REGEX_STRING))) {
      errors.push("createCollection/invalid-collection-name");
    }
  } else {
    errors.push("createCollection/empty-collection-name");
  }

  // Ověření, zda je v kolekci alespoň 1 balíček.
  if (deckArray.length <= 0) {
    errors.push("createCollection/empty-collection");
  }

  return errors;
};

/**
 * @function createCollection
 * @description Vytvoří v soubor s daty kolekce v databázi.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {string} req.body.colName - Název vytvářené kolekce.
 * @param {string} req.body.colDescription - Popisek vytvářené kolekce.
 * @param {Array<Object>} req.body.deckArray - Pole s balíčky, které obsahuje vytvářená kolekce.
 * @param {boolean} req.body.private - Informace o tom, zda je kolekce veřejná či soukromá.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {string} Pokud funkce proběhla úspěšně, vrací "successCode". Pokud nastala chyba, vrací errorový kód ("errorCode").
 * @async
 */
exports.createCollection = (req, res) => {
  // Ověření dat kolekce
  const errorCodes = validateCreateCollectionData(req.body.colName, req.body.deckArray);
  if (errorCodes.length > 0) {
    return res.status(400).json({ errorCodes: errorCodes });
  }

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
      return db
        .collection("users")
        .doc(req.user.uid)
        .update({
          createdCollections: admin.firestore.FieldValue.arrayUnion(docReference.id)
        });
    })
    .then(() => {
      return res.status(200).json({ successCode: "createCollection/collection-created" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};

/**
 * @function validateCollectionData
 * @description Ověří, zda-li obsahuje název kolekce pouze povolené znaky a zda-li je v kolekci alespoň 1 balíček.
 * @param {string} colName - Název kolekce.
 * @param {Array<Object>} deckArray - Pole balíčků.
 * @returns {Array<String>} Vrací pole error kódů. Pokud ověření proběhlo bez problému, vrací prázdné pole.
 */
const validateCollectionData = (colName, deckArray) => {
  let errors = [];

  // Ověření názvu kolekce.
  if (colName !== "") {
    if (!colName.match(DECK_COL_NAME_REGEX_STRING)) {
      errors.push("updateCollection/invalid-collection-name");
    }
  } else {
    errors.push("updateCollection/empty-collection-name");
  }

  // Ověření, zda je v kolekci alespoň 1 balíček.
  if (deckArray.length <= 0) {
    errors.push("updateCollection/empty-collection");
  }

  return errors;
};

/**
 * @function updateCollection
 * @description Upraví v soubor s daty kolekce v databázi.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {string} req.params.colId - ID upravované kolekce.
 * @param {string} req.body.colName - Název upravované kolekce.
 * @param {string} req.body.colDescription - Popisek upravované kolekce.
 * @param {Array<Object>} req.body.deckArray - Pole s kartami upravované kolekce.
 * @param {boolean} req.body.private - Informace o tom, zda je upravovaná kolekce veřejný či soukromý.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {string} Pokud funkce proběhla úspěšně, vrací "successCode". Pokud nastala chyba, vrací errorový kód ("errorCode").
 * @async
 */
exports.updateCollection = (req, res) => {
  // Ověření dat kolekce.
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
      // Ověření, zda-li je upravující uživatel majitelem kolekce.
      let creatorId = doc.data().creatorId;
      if (creatorId !== req.user.uid) {
        // Není majitelem, není oprávněn kolekci měnit.
        return res.status(401).json();
      } else {
        // Upravení kolekce.
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

/**
 * @function addDeckToCollection
 * @description Přidá daný balíček do kolekce.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {string} req.params.colId - ID kolekce, do které má být balíček přidán.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @async
 * @returns {string} Pokud nastala chyba, vrací errorový kód.
 */
exports.addDeckToCollection = (req, res) => {
  db.collection("collections")
    .doc(req.params.colId)
    .get()
    .then(doc => {
      // Ověření, zda-li je uživatel majitelem kolekce.
      let creatorId = doc.data().creatorId;
      if (creatorId !== req.user.uid) {
        // Není majitelem, není oprávněn do kolekce přidávat balíčky.
        return res.status(401).json();
      } else {
        // Přidání balíčku do seznamu balíčku v souboru kolekce.
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
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};

/**
 * @function deleteCollection
 * @description Odstraní kolekci z databáze.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {string} req.params.colId - ID kolekce, která má být odstraněna.
 * @returns {string} Pokud funkce proběhla úspěšně, vrací "successCode". Pokud nastala chyba, vrací errorový kód ("errorCode").
 * @async
 */
exports.deleteCollection = (req, res) => {
  let userDocRef = db.collection("users").doc(req.user.uid);
  let colDocRef = db.collection("collections").doc(req.params.colId);

  // Spuštění databázové transakce
  db.runTransaction(t => {
    return t
      .get(colDocRef)
      .then(doc => {
        // Ověření, zda-li je upravující uživatel majitelem kolekce
        let creatorId = doc.data().creatorId;
        if (creatorId !== req.user.uid) {
          // Není majitelem, není oprávněn kolekci smazat
          return res.status(401).json();
        } else {
          // Odstranění kolekce z databáze
          t.delete(colDocRef);

          // Odstranění kolekce ze seznamu uživatelem vytvořených kolekcí
          t.update(userDocRef, {
            createdCollections: admin.firestore.FieldValue.arrayRemove(req.params.colId)
          });

          // Získání všech souborů uživatelů, kteří si kolekci připnuli
          return db
            .collection("users")
            .where("pinnedCollections", "array-contains", req.params.colId)
            .get();
        }
      })
      .then(querySnapshot => {
        // Odstranění všech připnutí dané kolekce
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
/**
 * @function pinCollection
 * @description Připne uživateli danou kolekci.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {string} req.params.colId - ID kolekce, která má být připnuta.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @async
 * @returns {string} Pokud nastala chyba, vrací errorový kód.
 */
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
      .catch(error => res.status(500).json({ errorCode: error.code }));
  } else {
    res.status(400).json();
  }
};

/**
 * @function unpinCollection
 * @description Odepne uživateli danou kolekci.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {string} req.params.colId - ID kolekce, která má být odepnuta.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {string} Pokud nastala chyba, vrací errorový kód.
 * @async
 */
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
      .catch(error => res.status(500).json({ errorCode: error.code }));
  } else {
    res.status(400).json();
  }
};
//#endregion

//#region Collection UI
/**
 * @function getUserCollections
 * @description Získá seznam kolekcí vytvořených daným uživatelem.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Array<Object> | string} Vrací pole kolekcí, které byly vytvořeny uživatelem nebo errorové kódy.
 * @async
 */
exports.getUserCollections = (req, res) => {
  if (req.user.uid) {
    // Získá kolekce, které uživatel vytvořil.
    db.collection("collections")
      .where("creatorId", "==", req.user.uid)
      .get()
      .then(querySnapshot => {
        let userCollections = [];

        // Vytvoří pole kolekcí.
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

/**
 * @function getUserCollections
 * @description Získá seznam kolekcí vytvořených daným uživatelem společně s informací, zda-li je daný balíček obsažen v jednotlivých kolekcích.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Array<Object> | string} Vrací pole kolekcí, které byly vytvořeny uživatelem nebo errorové kódy.
 * @async
 */
exports.getUserCollectionsWithDeckInfo = (req, res) => {
  if (req.user.uid) {
    // Získá kolekce, které uživatel vytvořil
    db.collection("collections")
      .where("creatorId", "==", req.user.uid)
      .get()
      .then(querySnapshot => {
        let userCollections = [];

        // Vytvoří pole kolekcí
        querySnapshot.forEach(doc => {
          colData = {
            colName: doc.data().colName,
            colId: doc.id
          };

          // Zjistí, jestli je balíček obsažen v kolekci
          colData.containsDeck = doc.data().deckArray.includes(req.params.deckId) ? true : false;
          userCollections.push(colData);
        });
        return userCollections;
      })
      .then(userCollections => {
        res.status(200).json(userCollections);
      })
      .catch(error => res.status(500).json({ errorCode: error.code }));
  } else {
    res.status(401).json();
  }
};

/**
 * @function getPinnedCollections
 * @description Získá seznam kolekcí připnutých daným uživatelem.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Array<Object> | string} Vrací pole kolekcí, které byly připnuty uživatelem, nebo errorové kódy.
 * @async
 */
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
          // Vyhledá informace o každé připnuté kolekci.
          pinnedCollections.forEach(colId => {
            promises.push(
              db
                .collection("collections")
                .doc(colId)
                .get()
                .then(doc => {
                  // Přidá kolekci do exportCollections.
                  let colData = {
                    colName: doc.data().colName,
                    colId: doc.id
                  };

                  exportCollections.push(colData);
                })
            );
          });
        }

        // Počká, až se dokončí forEach cyklus.
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

/**
 * @function getCollection
 * @description Získá data dané kolekce.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {string} req.params.colId - ID dané kolekce.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Object | string} Vrací data o dané kolekci nebo errorové kódy.
 * @async
 */
exports.getCollection = (req, res) => {
  let collection;

  db.collection("collections")
    .doc(req.params.colId)
    .get()
    .then(colDoc => {
      if (colDoc.exists) {
        collection = colDoc.data();

        // Ověření, zda-li je upravující uživatel majitelem kolekce.
        let creatorId = collection.creatorId;
        if (collection.private === true && creatorId !== req.user.uid) {
          // Pokud je kolekce soukromá a uživatel není tvůrcem kolekce, nemá přístup ke kolekci.
          return res.status(403).json({ errorCode: "collection/access-denied" });
        } else {
          // Najde uživatelské jméno tvůrce této kolekce.
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
      // Zjistí, zda-li je kolekce připnuta uživatelem.
      return db
        .collection("users")
        .doc(req.user.uid)
        .get()
        .then(userDoc => {
          let pinnedCollections = userDoc.data().pinnedCollections;

          // Zjistí, zda-li je kolekce připnuta uživatelem.
          let isPinned = false;
          if (pinnedCollections) {
            pinnedCollections.forEach(pinnedCollection => {
              if (pinnedCollection === req.params.colId) {
                isPinned = true;
              }
            });
          }
          collection.isPinned = isPinned;

          // Zjistí, zda-li je uživatel tvůrcem kolekce.
          let isCreator = collection.creatorId === req.user.uid ? true : false;
          collection.isCreator = isCreator;

          return collection;
        });
    })
    .then(collection => {
      // Získá informace o balíčkách v kolekci (deckName, deckImage, deckId).
      let deckArray = collection.deckArray;
      let promises = [];

      if (deckArray) {
        let exportDecks = [];

        // Vyhledá informace o každém balíčku v kolekci.
        deckArray.forEach(deckId => {
          promises.push(
            db
              .collection("decks")
              .doc(deckId)
              .get()
              .then(doc => {
                // Přidá balíček do exportDecks.
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

      // Počká, až se dokončí forEach cyklus.
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
