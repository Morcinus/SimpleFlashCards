const { db } = require("../util/admin");
const { compareUnderstandingLevels, findUnknownCards } = require("../util/functions");

/**
 * @module deckCards
 * @category Funkce
 * @description Zde jsou funkce, které se starají o učení se balíčků.
 */

/**
 * @function setDeckCardsProgress
 * @description Nastaví pokrok uživatele pro jednotlivé karty balíčku, které se uživatel učil.
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele
 * @param {string} req.params.deckId - ID balíčku, který se uživatel učil
 * @param {Array<Object>} req.body.cardArray - Pole s kartami, kde je zaznamenán nový pokrok uživatele.
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @async
 */
exports.setDeckCardsProgress = (req, res) => {
  let newCardArray = req.body.cardArray;
  let deckId = req.params.deckId;

  // Cesta k dokumentu, ve kterém je zaznamenán pokrok uživatele v daném balíčku
  let progressDocRef = db
    .collection("users")
    .doc(`${req.user.uid}`)
    .collection("deckProgress")
    .doc(`${deckId}`);

  // Spuštění databázové transakce
  db.runTransaction(t => {
    return t.get(progressDocRef).then(doc => {
      // Získání pokrokových karet (tj. objektů v nichž je zaznamenáno ID karty a pokrok uživatele u této karty)
      let cardArray = [];
      if (doc.exists) cardArray = doc.data().cardArray ? doc.data().cardArray : [];

      // Aktualizování pole s pokrokovými kartami
      newCardArray.forEach(newCard => {
        // Najde danou pokrokovou kartu
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
        t.update(progressDocRef, { cardArray: cardArray });
      } else {
        // Vytvoří nový dokument a vloží do něj pokrok uživatele
        t.set(progressDocRef, {
          deckId: req.params.deckId, // Je to potřeba při hromadném odstraňování pokroku
          cardArray: cardArray
        });
      }
    });
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
 * @function getCardsToReview
 * @description Najde pro uživatele karty k zopakování z daného balíčku (počet karet je určen konstantou cardLimit).
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele
 * @param {string} req.params.deckId - ID balíčku, který se chce uživatel učit
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Array<Object>} exportCards - Pole karet.
 * @async
 */
exports.getCardsToReview = (req, res) => {
  const cardLimit = 20;
  let deckId = req.params.deckId;
  let progressCards = [];

  // Najde dokument s pokrokem uživatele
  db.collection("users")
    .doc(`${req.user.uid}`)
    .collection("deckProgress")
    .doc(`${deckId}`)
    .get()
    .then(doc => {
      progressCards = doc.data().cardArray;

      // Setřídí pole pokrokových karet podle toto, jak dobře je uživatel zná
      progressCards = progressCards.sort(compareUnderstandingLevels);

      // Ořízne pole tak, aby nepřesahovalo limit
      progressCards = progressCards.slice(0, cardLimit);

      // Získá daný balíček
      return db
        .collection("decks")
        .doc(`${deckId}`)
        .get();
    })
    .then(doc => {
      let cardArray = doc.data().cardArray;
      let exportCards = [];

      // Pro každou kartu, kterou se má uživatel učit, získá její obsah
      progressCards.forEach(progressCard => {
        let progressCardId = progressCard.cardId;

        // Najde k pokrokové kartě příslušnou kartu
        let exportCard = cardArray.find(({ cardId }) => cardId === progressCardId);

        // Vloží kartu do exportCards a přiřadí jí úroveň pochopení
        if (exportCard) {
          exportCard.understandingLevel = progressCard.understandingLevel;
          exportCards.push(exportCard);
        }
      });

      return exportCards;
    })
    .then(exportCards => {
      res.status(200).json(exportCards);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};

/**
 * @function getDeckUnknownCards
 * @description Najde pro uživatele karty z daného balíčku, které ještě uživatel nezná (počet karet je určen konstantou cardLimit).
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele
 * @param {string} req.params.deckId - ID balíčku, který se chce uživatel učit
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Array<Object>} exportCards - Pole karet.
 * @async
 */
exports.getDeckUnknownCards = (req, res) => {
  let deckId = req.params.deckId;
  let cardArray;
  let cardLimit = 20;

  // Najde daný balíček
  db.collection("decks")
    .doc(`${deckId}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        cardArray = doc.data().cardArray;

        // Najde příslušný dokument o pokroku uživatele
        return db
          .collection("users")
          .doc(`${req.user.uid}`)
          .collection("deckProgress")
          .doc(`${deckId}`)
          .get();
      } else {
        return res.status(404).json({ errorCode: "deck/deck-not-found" });
      }
    })
    .then(doc => {
      let unknownCards = [];
      // Pokud existuje příslušný dokument s pokrokem uživatele
      if (doc.exists) {
        // Najde karty, které uživatel ještě nezná a vloží je do unknownCards
        let progressCards = doc.data().cardArray;
        unknownCards = findUnknownCards(cardArray, progressCards);
      } else {
        // Uživatel nezná žádnou kartu => všechny jsou vloženy do unknownCards
        unknownCards = cardArray;
      }

      return unknownCards.slice(0, cardLimit);
    })
    .then(exportCards => {
      res.status(200).json(exportCards);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};

/**
 * @function getCardsToLearnAndReview
 * @description Najde pro uživatele karty, které ještě uživatel nezná a karty, které by si měl zopakovat(počet karet je určen konstantou cardLimit).
 * @param {Object} req - Požadavek, který přišel na server.
 * @param {string} req.user.uid - ID uživatele
 * @param {string} req.params.deckId - ID balíčku, který se chce uživatel učit
 * @param {Object} res - Odpověď na požadavek, který přišel na server.
 * @returns {Array<Object>} exportCards - Pole karet.
 * @async
 */
exports.getCardsToLearnAndReview = (req, res) => {
  let deckId = req.params.deckId;
  let cardArray = [];
  let cardLimit = 20;

  // Najde daný balíček
  db.collection("decks")
    .doc(`${deckId}`)
    .get()
    .then(doc => {
      cardArray = doc.data().cardArray;

      // Najde příslušný dokument o pokroku uživatele
      return db
        .collection("users")
        .doc(`${req.user.uid}`)
        .collection("deckProgress")
        .doc(`${deckId}`)
        .get();
    })
    .then(doc => {
      let exportCards = [];
      let progressCardsArray = [];
      let lastProgressCardIndex;
      if (doc.exists) progressCardsArray = doc.data().cardArray ? doc.data().cardArray : [];

      // Naplní půlku exportCards kartami, které uživatel ještě nezná
      if (progressCardsArray.length > 0) {
        // Setřídí pole pokrokových karet podle toto, jak dobře je uživatel zná
        progressCardsArray = progressCardsArray.sort(compareUnderstandingLevels);

        // Pro každou kartu, kterou se má uživatel učit, získá její obsah
        for (let i = 0; i < progressCardsArray.length; i++) {
          if (exportCards.length < Math.round(cardLimit / 2)) {
            // Najde k pokrokové kartě příslušnou kartu
            let exportCard = cardArray.find(({ cardId }) => cardId === progressCardsArray[i].cardId);

            // Vloží kartu do exportCards a přiřadí jí úroveň pochopení
            if (exportCard) {
              exportCard.understandingLevel = progressCardsArray[i].understandingLevel;
              exportCards.push(exportCard);
            }
          } else {
            lastProgressCardIndex = i;
            break;
          }
        }
      }

      // Najde karty, které uživatel ještě nezná
      let unknownCardsArray = findUnknownCards(cardArray, progressCardsArray);

      // Zaplní zbývající místo v exportCards kartami, které uživatel nezná
      for (let i = 0; i < unknownCardsArray.length; i++) {
        if (exportCards.length < cardLimit) {
          exportCards.push(unknownCardsArray[i]);
        } else break;
      }

      // Pokud ještě nebyl naplněn limit karet, zaplní zbývající místo v kartami, které si má uživatel zopakovat
      if (progressCardsArray.length > 0) {
        // Pokud progressCardsArray ještě obsahuje nějaké karty
        if (progressCardsArray.length > lastProgressCardIndex) {
          for (let i = lastProgressCardIndex; i < progressCardsArray.length; i++) {
            if (exportCards.length < cardLimit) {
              // Najde k pokrokové kartě příslušnou kartu
              let exportCard = cardArray.find(({ cardId }) => cardId === progressCardsArray[i].cardId);

              // Vloží kartu do exportCards a přiřadí jí úroveň pochopení
              if (exportCard) {
                exportCard.understandingLevel = progressCardsArray[i].understandingLevel;
                exportCards.push(exportCard);
              }
            } else break;
          }
        }
      }

      return exportCards;
    })
    .then(exportCards => {
      res.status(200).json(exportCards);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};
