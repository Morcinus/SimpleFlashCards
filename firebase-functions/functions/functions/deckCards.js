const { db } = require("../util/admin");

// Sets card progress
exports.setDeckCardsProgress = (req, res) => {
  let newCardArray = req.body.cardArray;
  let deckId = req.params.deckId;

  let progressDocRef = db
    .collection("users")
    .doc(`${req.user.uid}`)
    .collection("deckProgress")
    .doc(`${deckId}`);

  db.runTransaction(t => {
    return t.get(progressDocRef).then(doc => {
      // Get progress cards
      let cardArray = [];
      if (doc.exists) {
        cardArray = doc.data().cardArray ? doc.data().cardArray : [];
      }

      // Update the cardArray
      newCardArray.forEach(newCard => {
        for (let i = 0; i < cardArray.length; i++) {
          if (cardArray[i].cardId === newCard.cardId) {
            // Update the existing card
            cardArray[i] = newCard;
            return;
          }
        }
        // Push the new card
        cardArray.push(newCard);
      });

      if (doc.exists) {
        t.update(progressDocRef, { cardArray: cardArray });
      } else {
        t.set(progressDocRef, {
          deckId: req.params.deckId, // Is needed for collectionGroup - progress removing
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

// Gets the cards for review
exports.getCardsToReview = (req, res) => {
  const cardLimit = 20;
  let deckId = req.params.deckId;
  let progressCards = [];

  db.collection("users")
    .doc(`${req.user.uid}`)
    .collection("deckProgress")
    .doc(`${deckId}`)
    .get()
    .then(doc => {
      progressCards = doc.data().cardArray;

      // Sorts the array by understandingLevel
      progressCards = progressCards.sort(compareUnderstandingLevels);

      // Limits the array
      progressCards = progressCards.slice(0, cardLimit);

      // Get deck
      return db
        .collection("decks")
        .doc(`${deckId}`)
        .get();
    })
    .then(doc => {
      let cardArray = doc.data().cardArray;
      let exportCards = [];

      // Get cards
      progressCards.forEach(progressCard => {
        let progressCardId = progressCard.cardId;

        // Finds the card in cardArray
        let exportCard = cardArray.find(({ cardId }) => cardId === progressCardId);

        // Pushes the card to the export array
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

// Compares understanding levels of two progress cards
function compareUnderstandingLevels(card1, card2) {
  if (card1.understandingLevel < card2.understandingLevel) {
    return -1;
  }
  if (card1.understandingLevel > card2.understandingLevel) {
    return 1;
  }
  return 0;
}

// Gets cards that the user doesn't know yet
exports.getDeckUnknownCards = (req, res) => {
  let deckId = req.params.deckId;
  let cardArray;
  let cardLimit = 20;

  db.collection("decks")
    .doc(`${deckId}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        cardArray = doc.data().cardArray;

        // Get deck progress
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
      // Find unknown cards
      let unknownCards = [];
      if (doc.exists) {
        let progressCards = doc.data().cardArray;
        unknownCards = findUnknownCards(cardArray, progressCards);
      } else {
        unknownCards = cardArray;
      }

      return unknownCards.slice(0, cardLimit);
    })
    .then(unknownCards => {
      res.status(200).json(unknownCards);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ errorCode: err.code });
    });
};

// Finds cards the user doesn't know
function findUnknownCards(cardArrayRef, progressCardArray) {
  let unknownCardArray = [];

  // Clones array so that the original array does not get modified
  let cardArray = cardArrayRef.slice();

  // Deletes cards in cardArray that the user already knows
  progressCardArray.forEach(progressCard => {
    for (let i = 0; i < cardArray.length; i++) {
      // If the card is not already deleted
      if (cardArray[i])
        if (cardArray[i].cardId === progressCard.cardId) {
          delete cardArray[i];
        }
    }
  });

  // Pushes the remaining cards (=unknown cards)
  cardArray.forEach(card => {
    // If the card was not deleted
    if (typeof card !== undefined) {
      unknownCardArray.push(card);
    }
  });

  return unknownCardArray;
}

// Gets array of cards the user doesn't know and cards to review
exports.getCardsToLearnAndReview = (req, res) => {
  let deckId = req.params.deckId;
  let cardArray = [];
  let cardLimit = 20;

  db.collection("decks")
    .doc(`${deckId}`)
    .get()
    .then(doc => {
      cardArray = doc.data().cardArray;

      // Get deck progress
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

      // Fill half of exportCards with known cards
      if (progressCardsArray.length > 0) {
        // Sorts the array
        progressCardsArray = progressCardsArray.sort(compareUnderstandingLevels);

        // Pushes progress cards into the exportCards array
        for (let i = 0; i < progressCardsArray.length; i++) {
          if (exportCards.length < Math.round(cardLimit / 2)) {
            // Finds the card in cardArray
            let exportCard = cardArray.find(({ cardId }) => cardId === progressCardsArray[i].cardId);

            // Pushes the card to the export array
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

      // Finds unknown cards
      let unknownCardsArray = findUnknownCards(cardArray, progressCardsArray);

      // Fills the remaning space of exportCards with unknown cards
      for (let i = 0; i < unknownCardsArray.length; i++) {
        if (exportCards.length < cardLimit) {
          exportCards.push(unknownCardsArray[i]);
        } else break;
      }

      // If cardLimit still not reached, fill exportCards with known cards
      if (progressCardsArray.length > 0) {
        // If progressCardsArray still contains some cards
        if (progressCardsArray.length > lastProgressCardIndex) {
          // Pushes progress cards into the exportCards array
          for (let i = lastProgressCardIndex; i < progressCardsArray.length; i++) {
            if (exportCards.length < cardLimit) {
              // Finds the card in cardArray
              let exportCard = cardArray.find(({ cardId }) => cardId === progressCardsArray[i].cardId);

              // Pushes the card to the export array
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
