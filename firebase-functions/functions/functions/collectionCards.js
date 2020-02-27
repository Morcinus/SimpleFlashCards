const { db } = require("../util/admin");
const { compareUnderstandingLevels, findUnknownCards } = require("../util/functions");

/**
 * @module collectionCards
 * @category Funkce
 * @description Zde jsou funkce, které se starají o učení se kolekcí.
 */

/**
 * @function getProgressCards
 * @description Získá pokrokové karty pro celou kolekci.
 * @param {string} uid - ID uživatele
 * @param {Array<Object>} deckArray - Pole balíčků dané kolekce
 * @returns {Array<Object>} exportCards - Pole pokrokových karet dané kolekce
 * @async
 */
async function getProgressCards(uid, deckArray) {
  let exportCards = [];

  for (let i = 0; i < deckArray.length; i++) {
    await new Promise(function(resolve, reject) {
      db.collection("users")
        .doc(uid)
        .collection("deckProgress")
        .doc(deckArray[i])
        .get()
        .then(doc => {
          // Check whether doc exists
          if (doc.exists) {
            let progressCards = doc.data().cardArray;

            // Sorts the array by understandingLevel
            progressCards = progressCards.sort(compareUnderstandingLevels);

            // Push the cards to export array
            progressCards.forEach(card => {
              card.deckId = deckArray[i];
              exportCards.push(card);
            });
          }

          resolve();
        })
        .catch(error => reject(error));
    }).catch(error => console.error(error));
  }
  return exportCards;
}

/**
 * @function getExportCards
 * @description Získá karty na základě pokrokových karet, které jsou seskupeny do polí podle balíčků, ve kterých se karty nachází.
 * @param {Object} deckArrays - Objekt, ve kterém jsou karty seskupeny do polí podle ID balíčků, ve kterých se karty nachází.
 * @returns {Array<Object>} exportCards - Pole karet dané kolekce
 * @async
 */
async function getExportCards(deckArrays) {
  let exportCards = [];

  let deckIds = Object.keys(deckArrays);

  // Projde každé pole karet
  for (let i = 0; i < deckIds.length; i++) {
    // Získá daný balíček
    await db
      .collection("decks")
      .doc(`${deckIds[i]}`)
      .get()
      .then(doc => {
        let cardArray = doc.data().cardArray;

        // Pro každou kartu, kterou se má uživatel učit, získá její obsah
        deckArrays[deckIds[i]].forEach(progressCard => {
          let progressCardId = progressCard.cardId;

          // Najde k pokrokové kartě příslušnou kartu
          let exportCard = cardArray.find(({ cardId }) => cardId === progressCardId);

          // Vloží kartu do exportCards a přiřadí jí úroveň pochopení
          if (exportCard) {
            exportCard.understandingLevel = progressCard.understandingLevel;
            exportCard.deckId = deckIds[i];
            exportCards.push(exportCard);
          }
        });
      })
      .catch(error => console.error(error));
  }

  return exportCards;
}

/**
 * @function groupIntoArrays
 * @description Seskupí karty do polí podle ID balíčků, ze kterých karty pochází.
 * @param {Array<Object>} cardArray - Pole karet, které mají být seskupeny
 * @returns {Object} deckArrays - Objekt, ve kterém jsou karty seskupeny do polí podle ID balíčků, ve kterých se karty nachází.
 * @async
 */
function groupIntoArrays(cardArray) {
  // Klonování cardArray (deep clone)
  let cards = JSON.parse(JSON.stringify(cardArray));

  let deckArrays = {};
  if (cards.length > 0) {
    cards.forEach(card => {
      let deckId = card.deckId;

      // Zkontroluje, zda-li už je v deckArrays pole s daným ID balíčku
      if (deckArrays.hasOwnProperty(deckId)) {
        // Vloží kartu do příslušného pole
        deckArrays[deckId].push(card);
      } else {
        // Vytvoří nové pole v deckArrays a přidá do něj kartu
        deckArrays[deckId] = [card];
      }

      // Smaže deckId karty (protože už není potřeba)
      delete card.deckId;
    });
  }

  return deckArrays;
}

/**
 * @function getColCardsToReview
 * @description Najde pro uživatele karty k zopakování z dané kolekce (počet karet je určen konstantou cardLimit).
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele
 * @param {string} req.params.colId - ID kolekce, kterou se chce uživatel učit
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Array<Object>} exportCards - Pole karet.
 * @async
 */
exports.getColCardsToReview = (req, res) => {
  const cardLimit = 20;

  // Najde dokument s danou kolekcí
  db.collection("collections")
    .doc(req.params.colId)
    .get()
    .then(colDoc => {
      let deckArray = colDoc.data().deckArray;

      // Získá pokrokové karty dané kolekce
      return getProgressCards(req.user.uid, deckArray);
    })
    .then(progressCards => {
      // Setřídí pole pokrokových karet podle toto, jak dobře je uživatel zná
      progressCards = progressCards.sort(compareUnderstandingLevels);

      // Ořízne pole tak, aby nepřesahovalo limit
      progressCards = progressCards.slice(0, cardLimit);

      return progressCards;
    })
    .then(async progressCards => {
      // Seskupí pokrokové karty do polí podle ID balíčků
      let groupedProgressCards = groupIntoArrays(progressCards);

      // Získá k pokrokovým kartám příslušné karty
      let exportCards = await getExportCards(groupedProgressCards);

      // Seskupí pokrokové karty do polí podle ID balíčků
      return groupIntoArrays(exportCards);
    })
    .then(exportCards => {
      res.status(200).json({ cardArray: exportCards });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};

/**
 * @function getColUnknownCards
 * @description Najde pro uživatele karty z dané kolekce, které ještě uživatel nezná (počet karet je určen konstantou cardLimit).
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele
 * @param {string} req.params.colId - ID kolekce, kterou se chce uživatel učit
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Array<Object>} exportCards - Pole karet.
 * @async
 */
exports.getColUnknownCards = (req, res) => {
  const cardLimit = 5;
  let exportCardsArray = [];

  // Najde dokument s danou kolekcí
  db.collection("collections")
    .doc(req.params.colId)
    .get()
    .then(async colDoc => {
      let deckArray = colDoc.data().deckArray;

      let breakLoop = false;
      // Bude procházet balíčky, dokud nedovrší limitu karet
      for (let i = 0; i < deckArray.length; i++) {
        if (breakLoop) {
          break;
        } else {
          let progressCards = [];

          // Najde příslušný dokument o pokroku uživatele
          await db
            .collection("users")
            .doc(req.user.uid)
            .collection("deckProgress")
            .doc(deckArray[i])
            .get()
            .then(doc => {
              // Pokud existuje příslušný dokument s pokrokem uživatele, najde neznámé karty
              if (doc.exists) {
                progressCards = doc.data().cardArray;
                return db
                  .collection("decks")
                  .doc(deckArray[i])
                  .get()
                  .then(doc => {
                    // Najde karty, které uživatel ještě nezná a vloží je do unknownCards
                    let cardArray = doc.data().cardArray;
                    let unknownCards = findUnknownCards(cardArray, progressCards);
                    return unknownCards;
                  })
                  .catch(err => {
                    console.error(err);
                    return res.status(500).json({ errorCode: err.code });
                  });
              } else {
                // Uživatel nezná žádnou kartu => všechny jsou vloženy do unknownCards
                return db
                  .collection("decks")
                  .doc(deckArray[i])
                  .get()
                  .then(doc => {
                    let unknownCards = doc.data().cardArray;
                    return unknownCards;
                  })
                  .catch(err => {
                    console.error(err);
                    return res.status(500).json({ errorCode: err.code });
                  });
              }
            })
            .then(cardArray => {
              // Doplní exportCardsArray, dokud nedovrší limitu karet
              if (cardArray.length + exportCardsArray.length < cardLimit) {
                // Vloží všechny karty do exportCardsArray
                for (let j = 0; j < cardArray.length; j++) {
                  let card = cardArray[j];
                  card.deckId = deckArray[i];
                  exportCardsArray.push(card);
                }
                // Karty nebudou stačit => pokračuje cyklus
                return;
              } else if (cardArray.length + exportCardsArray.length >= cardLimit) {
                for (let j = 0; j <= cardLimit - exportCardsArray.length; j++) {
                  // Vloží karty do exportCardsArray, dokud se nedovrší limitu
                  let card = cardArray[j];
                  card.deckId = deckArray[i];
                  exportCardsArray.push(card);
                }
                // Dosáhlo se limitu karet => ukončí se cyklus
                breakLoop = true;
                return;
              }
            })
            .catch(err => {
              console.error(err);
              return res.status(500).json({ errorCode: err.code });
            });
        }
      }

      // Seskupí pokrokové karty do polí podle ID balíčků
      return groupIntoArrays(exportCardsArray);
    })
    .then(exportCards => {
      res.status(200).json({ cardArray: exportCards });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};

/**
 * @function getColCardsToLearnAndReview
 * @description Najde pro uživatele karty kolekce, které ještě uživatel nezná, a karty, které by si měl zopakovat (počet karet je určen konstantou cardLimit).
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele
 * @param {string} req.params.colId - ID kolekce, kterou se chce uživatel učit
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Array<Object>} exportCards - Pole karet.
 * @async
 */
exports.getColCardsToLearnAndReview = (req, res) => {
  const cardLimit = 10;
  let unknownCardsLimit = cardLimit / 2;
  let progressCards = [];
  let exportCardsArray = [];
  let deckArray = [];

  // Najde dokument s danou kolekcí
  db.collection("collections")
    .doc(req.params.colId)
    .get()
    .then(colDoc => {
      deckArray = colDoc.data().deckArray;

      // Získá pokrokové karty dané kolekce
      return getProgressCards(req.user.uid, deckArray);
    })
    .then(unsortedProgressCards => {
      // Setřídí pole pokrokových karet podle toto, jak dobře je uživatel zná
      progressCards = unsortedProgressCards.sort(compareUnderstandingLevels);

      // Pokud není dostatek pokrokových karet, upraví unknownCardsLimit
      if (progressCards.length < Math.round(cardLimit / 2)) {
        unknownCardsLimit = cardLimit - progressCards.length;
      }

      // Seskupí pokrokové karty do polí podle ID balíčků
      return groupIntoArrays(progressCards);
    })
    .then(async groupedProgressCards => {
      let breakLoop = false;

      // Bude procházet balíčky, dokud nedovrší limitu karet
      for (let i = 0; i < deckArray.length; i++) {
        if (breakLoop) {
          break;
        } else {
          // Získá pokrokové karty daného balíčku
          let progressCards = groupedProgressCards[deckArray[i]];

          // Najde neznámé karty
          await new Promise((resolve, reject) => {
            // Pokud má uživatel nějaký pokrok v balíčku, najde neznámé karty
            if (progressCards) {
              return db
                .collection("decks")
                .doc(deckArray[i])
                .get()
                .then(doc => {
                  // Najde karty, které uživatel ještě nezná a vloží je do unknownCards
                  let cardArray = doc.data().cardArray;
                  let unknownCards = findUnknownCards(cardArray, progressCards);
                  resolve(unknownCards);
                })
                .catch(error => reject(error));
            } else {
              // Uživatel nezná žádnou kartu => všechny jsou vloženy do unknownCards
              return db
                .collection("decks")
                .doc(deckArray[i])
                .get()
                .then(doc => {
                  let unknownCards = doc.data().cardArray;
                  resolve(unknownCards);
                })
                .catch(error => reject(error));
            }
          })
            .then(cardArray => {
              // Doplní exportCardsArray, dokud nedovrší limitu karet
              if (cardArray.length + exportCardsArray.length < unknownCardsLimit) {
                // Vloží všechny karty do exportCardsArray
                for (let j = 0; j < cardArray.length; j++) {
                  let card = cardArray[j];
                  card.deckId = deckArray[i];
                  exportCardsArray.push(card);
                }
                // Karty nebudou stačit => pokračuje cyklus
                return;
              } else if (cardArray.length + exportCardsArray.length >= unknownCardsLimit) {
                let exportCardsLength = exportCardsArray.length;
                for (let j = 0; j < unknownCardsLimit - exportCardsLength; j++) {
                  // Vloží karty do exportCardsArray, dokud se nedovrší limitu
                  let card = cardArray[j];
                  card.deckId = deckArray[i];
                  exportCardsArray.push(card);
                }
                // Dosáhlo se limitu karet => ukončí se cyklus
                breakLoop = true;
                return;
              }
            })
            .catch(err => {
              console.error(err);
              return res.status(500).json({ errorCode: err.code });
            });
        }
      }
    })
    .then(async () => {
      // Pokud ještě nebyl naplněn limit karet, zaplní zbývající místo v kartami, které si má uživatel zopakovat
      if (exportCardsArray.length < cardLimit) {
        let progressCardsLimit = cardLimit - exportCardsArray.length;

        // Ořízne pole tak, aby nepřesahovalo limit karet
        let slicedProgressCards = progressCards.slice(0, progressCardsLimit);

        // Seskupí pokrokové karty do polí podle ID balíčků
        let groupedProgressCards = groupIntoArrays(slicedProgressCards);

        // Získá k pokrokovým kartám příslušné karty a vloží je do exportCardsArray
        await getExportCards(groupedProgressCards).then(exportCards => {
          exportCards.forEach(exportCard => {
            exportCardsArray.push(exportCard);
          });
        });
      }

      // Seskupí pokrokové karty do polí podle ID balíčků
      return groupIntoArrays(exportCardsArray);
    })
    .then(exportCards => {
      res.status(200).json({ cardArray: exportCards });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};

/**
 * @function setDeckCardsProgress
 * @description Nastaví pokrok uživatele pro jednotlivé karty kolekce, které se uživatel učil.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele
 * @param {Array<Object>} req.body.cardArray - Pole s kartami, kde je zaznamenán nový pokrok uživatele.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @async
 */
exports.setColCardsProgress = (req, res) => {
  let newCardArray = req.body.cardArray;

  let deckIds = Object.keys(newCardArray);

  new Promise(async (resolve, reject) => {
    let batch = db.batch();

    for (let i = 0; i < deckIds.length; i++) {
      // Najde příslušný dokument o pokroku uživatele
      let progressDocRef = db
        .collection("users")
        .doc(req.user.uid)
        .collection("deckProgress")
        .doc(deckIds[i]);

      await progressDocRef.get().then(doc => {
        // Získání pokrokových karet (tj. objektů v nichž je zaznamenáno ID karty a pokrok uživatele u této karty)
        let cardArray = [];
        if (doc.exists) cardArray = doc.data().cardArray ? doc.data().cardArray : [];

        // Aktualizování pole s pokrokovými kartami daného balíčku
        newCardArray[deckIds[i]].forEach(newCard => {
          for (let i = 0; i < cardArray.length; i++) {
            if (cardArray[i].cardId === newCard.cardId) {
              // Aktualizace pokrokové karty
              cardArray[i] = newCard;
              return;
            }
          }
          // Pokud se nenašla daná pokroková karta v poli, přidá se do pole jako nová
          cardArray.push(newCard);
        });

        // Pokud existuje dokument s pokrokem balíčku
        if (doc.exists) {
          // Zaktualizuje data
          batch.update(progressDocRef, { cardArray: cardArray });
        } else {
          // Vytvoří nový dokument a vloží do něj pokrok uživatele
          batch.set(progressDocRef, {
            deckId: deckIds[i], // Je to potřeba při hromadném odstraňování pokroku
            cardArray: cardArray
          });
        }
      });
    }

    resolve(batch);
  })
    .then(batch => {
      return batch.commit();
    })
    .then(() => {
      res.status(200).json();
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};
