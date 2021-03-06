const { db, admin } = require("../util/admin");
const config = require("../util/firebaseConfig");

const { Storage } = require("@google-cloud/storage");

const { DECK_COL_NAME_REGEX_STRING } = require("../util/other");

/**
 * @module deck
 * @category Funkce
 * @description Zde jsou funkce, které se starají o data balíčků.
 */

//#region Deck Editing
/**
 * @function validateDeckData
 * @description Ověří, zda-li obsahuje název balíčku pouze povolené znaky a zda-li je v balíčku alespoň 1 karta.
 * @param {string} deckName - Název balíčku.
 * @param {Array<Object>} cardArray - Pole karet.
 * @returns {Array<String>} Vrací pole error kódů. Pokud ověření proběhlo bez problému, vrací prázdné pole.
 */
const validateDeckData = (deckName, cardArray) => {
  let errors = [];

  // Ověření názvu balíčku.
  if (deckName !== "") {
    if (!deckName.match(new RegExp(DECK_COL_NAME_REGEX_STRING))) {
      errors.push("createDeck/invalid-deck-name");
    }
  } else {
    errors.push("createDeck/empty-deck-name");
  }

  // Ověření, zda je v balíčku alespoň 1 karta.
  if (cardArray.length <= 0) {
    errors.push("createDeck/empty-deck");
  }

  return errors;
};

/**
 * @function createDeck
 * @description Vytvoří v soubor s daty balíčku v databázi.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {string} req.body.deckName - Název vytvářeného balíčku.
 * @param {string} req.body.deckDescription - Popisek vytvářeného balíčku.
 * @param {Array<Object>} req.body.deckCards - Pole s kartami vytvářeného balíčku.
 * @param {boolean} req.body.private - Informace o tom, zda je balíček veřejný či soukromý.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {string} Vrací ID vytvořeného balíčku. Pokud nastala chyba, vrací errorový kód.
 * @async
 */
exports.createDeck = (req, res) => {
  // Ověření dat balíčku.
  const errorCodes = validateDeckData(req.body.deckName, req.body.deckCards);
  if (errorCodes.length > 0) {
    return res.status(400).json({ errorCodes: errorCodes });
  }

  // Vygenerování ID pro každou kartu v balíčku.
  let cardArray = [];
  req.body.deckCards.forEach((card) => {
    let newCard = card;
    newCard.cardId = newId();
    cardArray.push(newCard);
  });

  // Vytvoření deckData.
  const deckData = {
    creatorId: req.user.uid,
    deckName: req.body.deckName,
    deckDescription: req.body.deckDescription ? req.body.deckDescription : null,
    cardArray: cardArray,
    private: req.body.private,
  };

  // Přídání balíčku do databáze.
  db.collection("decks")
    .add(deckData)
    .then((docReference) => {
      // Zapsání balíčku do seznamu balíčků vytvořených daným uživatelem.
      db.collection("users")
        .doc(req.user.uid)
        .update({
          createdDecks: admin.firestore.FieldValue.arrayUnion(docReference.id),
        });

      return docReference.id;
    })
    .then((deckId) => {
      res.status(200).json({ deckId: deckId });
    })
    .catch((err) => {
      return res.status(500).json({ errorCode: err.code });
    });
};

/**
 * @function updateDeck
 * @description Upraví v soubor s daty balíčku v databázi.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {string} req.params.deckId - ID upravovaného balíčku.
 * @param {string} req.body.deckName - Název upravovaného balíčku.
 * @param {string} req.body.deckDescription - Popisek upravovaného balíčku.
 * @param {Array<Object>} req.body.deckCards - Pole s kartami upravovaného balíčku.
 * @param {boolean} req.body.private - Informace o tom, zda je upravovaný balíček veřejný či soukromý.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {string} Pokud funkce proběhla úspěšně, vrací "successCode". Pokud nastala chyba, vrací errorový kód ("errorCode").
 * @async
 */
exports.updateDeck = (req, res) => {
  // Ověření dat balíčku.
  const errorCodes = validateDeckData(req.body.deckName, req.body.deckCards);
  if (errorCodes.length > 0) {
    return res.status(400).json({ errorCodes: errorCodes });
  }

  let deckDocRef = db.collection("decks").doc(req.params.deckId);
  let deletedCards = [];

  // Spuštění databázové transakce.
  db.runTransaction((t) => {
    return t
      .get(deckDocRef)
      .then((doc) => {
        // Ověření, zda-li je upravující uživatel majitelem balíčku.
        let creatorId = doc.data().creatorId;
        if (creatorId !== req.user.uid) {
          // Není majitelem, není oprávněn balíček měnit.
          return res.status(401).json();
        } else {
          // Vygenerování ID pro každou kartu v balíčku.
          let cardArray = [];
          req.body.deckCards.forEach((card) => {
            if (!card.cardId) {
              let newCard = card;
              newCard.cardId = newId();
              cardArray.push(newCard);
            } else {
              cardArray.push(card);
            }
          });

          // Vytvoření nových deckData.
          let deckData = {
            deckName: req.body.deckName,
            deckDescription: req.body.deckDescription ? req.body.deckDescription : null,
            cardArray: cardArray,
            private: req.body.private,
          };

          // Upravení balíčku.
          t.update(deckDocRef, deckData);

          // Najde karty, které byly z balíčku odstraněny.
          let oldCardArray = doc.data().cardArray;
          let newCardArray = req.body.deckCards;
          deletedCards = findDeletedCards(oldCardArray, newCardArray);

          // Najde všechny soubory, kde je zaznamenán pokrok učení tohoto balíčku.
          return db.collectionGroup("deckProgress").where("deckId", "==", req.params.deckId).get();
        }
      })
      .then((querySnapshot) => {
        // Odstraní pokroky smazaných karet ze souborů s pokroky daných uživatelů.
        querySnapshot.forEach((progressDoc) => {
          let progressCards = progressDoc.data().cardArray;

          // Odstraní smazané karty z progressCards pole.
          deletedCards.forEach((deletedCard) => {
            for (let i = 0; i < progressCards.length; i++) {
              // Pokud není karta ještě smazána, zmaže ji.
              if (progressCards[i])
                if (progressCards[i].cardId === deletedCard.cardId) {
                  delete progressCards[i];
                }
            }
          });

          // Vytvoří pole nesmazaných karet.
          let newProgressCards = [];
          progressCards.forEach((card) => {
            // Pokud nebyla karta smazána, vloží ji do newProgressCards pole.
            if (typeof card !== undefined) {
              newProgressCards.push(card);
            }
          });

          // Uloží nové pole pokroku karet.
          t.update(progressDoc.ref, { cardArray: newProgressCards });
        });
      });
  })
    .then(() => {
      res.status(200).json({ successCode: "updateDeck/deck-updated" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};

/**
 * @function findDeletedCards
 * @description Porovná dvě pole a najde v prvním poli (firstArray) karty, které byly již v druhém poli (secondArray) smazány.
 * @param {Array<Object>} firstArray - Pole, ve kterém smazané karty stále jsou.
 * @param {Array<Object>} secondArray - Pole, ve kterém smazané karty již nejsou.
 * @returns {Array<Object>} Vrací pole karet, které byly smazány.
 * @async
 */
function findDeletedCards(firstArray, secondArray) {
  let deletedCards = firstArray.filter(function checkInSecondArray(card1) {
    // Najde card1 v secondArray
    let foundCard = secondArray.find(function isWantedCard(card2) {
      return card1.cardId === card2.cardId;
    });

    return foundCard ? false : true;
  });

  return deletedCards;
}

/**
 * @function deleteDeck
 * @description Odstraní balíček z databáze.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {string} req.params.deckId - ID balíčku, který má být odstraněn.
 * @returns {string} Pokud funkce proběhla úspěšně, vrací "successCode". Pokud nastala chyba, vrací errorový kód ("errorCode").
 * @async
 */
exports.deleteDeck = (req, res) => {
  let userDocRef = db.collection("users").doc(req.user.uid);
  let deckDocRef = db.collection("decks").doc(req.params.deckId);
  let authorized;

  // Spuštění databázové transakce.
  db.runTransaction((t) => {
    return t
      .get(deckDocRef)
      .then((doc) => {
        // Ověření, zda-li je upravující uživatel majitelem balíčku.
        let creatorId = doc.data().creatorId;
        if (creatorId !== req.user.uid) {
          // Není majitelem, není oprávněn balíček smazat.
          authorized = false;
          return res.status(401).json();
        } else {
          authorized = true;
          // Odstranění balíčku z databáze.
          t.delete(deckDocRef);

          // Odstranění balíčku ze seznamu uživatelem vytvořených balíčků.
          t.update(userDocRef, {
            createdDecks: admin.firestore.FieldValue.arrayRemove(req.params.deckId),
          });

          // Získání všech kolekcí, ve kterém se balíček nachází.
          return db.collection("collections").where("deckArray", "array-contains", req.params.deckId).get();
        }
      })
      .then((querySnapshot) => {
        // Odstranění balíčku z každé kolekce.
        querySnapshot.forEach((colDoc) => {
          t.update(colDoc.ref, {
            deckArray: admin.firestore.FieldValue.arrayRemove(req.params.deckId),
          });
        });

        // Získání všech souborů uživatelů, kteří si balíček připnuli.
        return db.collection("users").where("pinnedDecks", "array-contains", req.params.deckId).get();
      })
      .then((querySnapshot) => {
        // Odstranění všech připnutí daného balíčku.
        querySnapshot.forEach((userDoc) => {
          t.update(userDoc.ref, {
            pinnedDecks: admin.firestore.FieldValue.arrayRemove(req.params.deckId),
          });
        });

        // Získání všech souborů, ve kterých je zaznamenán pokrok učení balíčku.
        return db.collectionGroup("deckProgress").where("deckId", "==", req.params.deckId).get();
      })
      .then((querySnapshot) => {
        // Smazání všech pokroků učení balíčku.
        querySnapshot.forEach((progressDoc) => {
          t.delete(progressDoc.ref);
        });
      });
  })
    .then(() => {
      // Odstranění obrázku balíčku.
      if (authorized === true) {
        const storage = new Storage();
        const bucket = storage.bucket(config.storageBucket);
        const pngFile = bucket.file(`${req.params.deckId}.png`);
        const jpgFile = bucket.file(`${req.params.deckId}.jpg`);

        // Najde .png obrázek.
        pngFile.exists().then((data) => {
          const exists = data[0];
          if (exists) {
            // Odstraní .PNG obrázek.
            pngFile.delete();
          } else {
            // Najde .jpg obrázek.
            jpgFile.exists().then((data) => {
              const exists = data[0];
              if (exists) {
                // Odstraní .jpg obrázek.
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
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};

/**
 * @function newId
 * @description Vygeneruje nové 20 místné ID.
 * @returns {string} newId
 */
function newId() {
  // Alfanumerické znaky
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let newId = "";
  for (let i = 0; i < 20; i++) {
    newId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return newId;
}

/**
 * @function uploadDeckImage
 * @description Nahraje obrázek do Cloud Storage.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {string} Pokud funkce proběhla úspěšně, vrací "successCode". Pokud nastala chyba, vrací errorový kód ("errorCode").
 * @async
 */

exports.uploadDeckImage = (req, res) => {
  /* Kód na nahrání obrázku do Cloud Storage
  Tento kód je založen na následujícím návodu.
  Zdroj: https://youtu.be/ecgAwgHXYos?t=152
  Autor: Classed
  Datum: 13.03.2020
*/
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    // Ověření typu nahraného souboru.
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    // Vytvoření názvu souboru.
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${req.params.deckId}.${imageExtension}`;

    // Připravení souboru na nahrání.
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    // Nahrání souboru do Cloud Storage.
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        // Uložení adresy obrázku do souboru balíčku.
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;

        return db.doc(`/decks/${req.params.deckId}`).update({ deckImage: imageUrl });
      })
      .then(() => {
        return res.status(200).json({ successCode: "createDeck/image-uploaded" });
      })
      .catch((err) => {
        return res.status(500).json({ errorCode: err.code });
      });
  });
  busboy.end(req.rawBody);
  /* konec citovaného kódu */
};

//#endregion

//#region Deck Pinning
/**
 * @function pinDeck
 * @description Připne uživateli daný balíček.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {string} req.params.deckId - ID balíčku, který má být připnut.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {string} Pokud nastala chyba, vrací errorový kód.
 * @async
 */
exports.pinDeck = (req, res) => {
  if (req.params.deckId) {
    // Přidá balíček do pole připnutých balíčků v souboru uživatele.
    db.collection("users")
      .doc(req.user.uid)
      .update({
        pinnedDecks: admin.firestore.FieldValue.arrayUnion(req.params.deckId),
      })
      .then(() => {
        res.status(200).json();
      })
      .catch((error) => res.status(500).json({ errorCode: error.code }));
  } else {
    res.status(400).json();
  }
};

/**
 * @function unpinDeck
 * @description Odepne uživateli daný balíček.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {string} req.params.deckId - ID balíčku, který má být odepnut.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {string} Pokud nastala chyba, vrací errorový kód.
 * @async
 */
exports.unpinDeck = (req, res) => {
  if (req.params.deckId) {
    // Odebere balíček z pole připnutých balíčků v souboru uživatele.
    db.collection("users")
      .doc(req.user.uid)
      .update({
        pinnedDecks: admin.firestore.FieldValue.arrayRemove(req.params.deckId),
      })
      .then(() => {
        res.status(200).json();
      })
      .catch((error) => res.status(500).json({ errorCode: error.code }));
  } else {
    res.status(400).json();
  }
};
//#endregion

//#region Deck UI
/**
 * @function getUserDecks
 * @description Získá seznam balíčků vytvořených daným uživatelem.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Array<Object> | string} Vrací pole balíčků, které byly vytvořeny uživatelem nebo errorové kódy.
 * @async
 */
exports.getUserDecks = (req, res) => {
  // Získá balíčky, které uživatel vytvořil.
  db.collection("decks")
    .where("creatorId", "==", req.user.uid)
    .get()
    .then((querySnapshot) => {
      let userDecks = [];

      // Vytvoří pole balíčků.
      querySnapshot.forEach((doc) => {
        exportDeck = {
          deckName: doc.data().deckName,
          deckImage: doc.data().deckImage,
          deckId: doc.id,
        };
        userDecks.push(exportDeck);
      });
      return userDecks;
    })
    .then((userDecks) => {
      if (userDecks.length > 0) {
        res.status(200).json(userDecks);
      } else {
        res.status(404).json({ errorCode: "deck/no-deck-found" });
      }
    })
    .catch((error) => res.status(500).json({ errorCode: error.code }));
};

/**
 * @function getPinnedDecks
 * @description Získá seznam balíčků připnutých daným uživatelem.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Array<Object> | string} Vrací pole balíčků, které byly připnuty uživatelem, nebo errorové kódy.
 * @async
 */
exports.getPinnedDecks = (req, res) => {
  let exportDecks = [];

  db.collection("users")
    .doc(req.user.uid)
    .get()
    .then((doc) => {
      let pinnedDecks = doc.data().pinnedDecks;
      let promises = [];

      if (pinnedDecks) {
        // Vyhledá informace o každé připnutém balíčku.
        pinnedDecks.forEach((deckId) => {
          promises.push(
            db
              .collection("decks")
              .doc(deckId)
              .get()
              .then((doc) => {
                // Přidá balíček do exportDecks.
                let exportDeck = {
                  deckName: doc.data().deckName,
                  deckImage: doc.data().deckImage,
                  deckId: doc.id,
                };

                exportDecks.push(exportDeck);
              })
          );
        });
      }

      // Počká, až se dokončí forEach cyklus.
      return Promise.all(promises);
    })
    .then(() => {
      if (exportDecks.length > 0) {
        res.status(200).json(exportDecks);
      } else {
        res.status(404).json({ errorCode: "deck/no-deck-found" });
      }
    })
    .catch((error) => res.status(500).json({ errorCode: error.code }));
};

/**
 * @function getDeck
 * @description Získá data daného balíčku.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele.
 * @param {string} req.params.deckId - ID daného balíčku.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Object | string} Vrací data o daném balíčku nebo errorové kódy.
 * @async
 */
exports.getDeck = (req, res) => {
  db.collection("decks")
    .doc(`${req.params.deckId}`)
    .get()
    .then((deckDoc) => {
      if (deckDoc.exists) {
        let deck = deckDoc.data();

        // Ověření, zda-li je upravující uživatel majitelem balíčku.
        let creatorId = deck.creatorId;
        if (deck.private === true && creatorId !== req.user.uid) {
          // Pokud je balíček soukromý a uživatel není tvůrcem balíčku, nemá přístup k balíčku.
          return res.status(403).json({ errorCode: "deck/access-denied" });
        } else {
          // Najde uživatelské jméno tvůrce tohoto balíčku.
          return db
            .collection("users")
            .doc(deck.creatorId)
            .get()
            .then((userDoc) => {
              deck.creatorName = userDoc.data().username;
              return deck;
            });
        }
      } else {
        return res.status(404).json({ errorCode: "deck/deck-not-found" });
      }
    })
    .then((deck) => {
      // Zjistí, zda-li je balíček připnut uživatelem.
      return db
        .collection("users")
        .doc(req.user.uid)
        .get()
        .then((userDoc) => {
          let pinnedDecks = userDoc.data().pinnedDecks;

          // Zjistí, zda-li je balíček připnut uživatelem.
          let isPinned = false;
          if (pinnedDecks) {
            pinnedDecks.forEach((pinnedDeck) => {
              if (pinnedDeck === req.params.deckId) {
                isPinned = true;
              }
            });
          }
          deck.isPinned = isPinned;

          // Zjistí, zda-li je uživatel tvůrcem balíčku.
          let isCreator = deck.creatorId === req.user.uid ? true : false;
          deck.isCreator = isCreator;

          return deck;
        });
    })
    .then((deck) => {
      res.status(200).json({ deck });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};
//#endregion
