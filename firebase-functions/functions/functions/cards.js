const { db } = require("../util/admin");

// Loads all cards from one deck
exports.getDeckCards = (req, res) => {
  db.collection("decks")
    .doc(`${req.params.deckId}`)
    .get()
    .then(doc => {
      res.status(200).json(doc.data().cardArray);
    })
    .catch(error => console.error(error));
};

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
      let cardArray = [];
      if (doc.exists) {
        cardArray = doc.data().cardArray ? doc.data().cardArray : [];
      }
      console.log(cardArray);

      // Update the cardArray
      newCardArray.forEach(newCard => {
        console.log("Looping with: ", newCard);
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
    .catch(error => console.error(error));
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

      return db
        .collection("decks")
        .doc(`${deckId}`)
        .get();
    })
    .then(doc => {
      let cardArray = doc.data().cardArray;
      let exportCards = [];

      progressCards.forEach(progressCard => {
        let progressCardId = progressCard.cardId;

        // Finds the card in cardArray
        let exportCard = cardArray.find(
          ({ cardId }) => cardId === progressCardId
        );

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
    .catch(error => console.error(error));
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

// TO-DO: needs error handling - if deck doesnt exist etc.. - EVERY FB FUNCTION
// TO-DO: Needs error handling if card is no longer in deck !! if the owner changed deck
// Gets cards that the user doesn't know yet
exports.getDeckUnknownCards = (req, res) => {
  let deckId = req.params.deckId;
  let cardArray;
  let cardLimit = 20;

  db.collection("decks")
    .doc(`${deckId}`)
    .get()
    .then(doc => {
      cardArray = doc.data().cardArray;

      return db
        .collection("users")
        .doc(`${req.user.uid}`)
        .collection("deckProgress")
        .doc(`${deckId}`)
        .get();
    })
    .then(doc => {
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
    .catch(error => console.error(error));
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
    if (card !== undefined) {
      unknownCardArray.push(card);
    }
  });

  return unknownCardArray;
}

// Gets array of cards the user doesn't know and cards to review
// NEEDS UPDATE: To include cards that are over understandingLevel 5 if user knows all the cards <- Rethinkg the whole algorithm
// PREKOPAT: Aby nejdriv pushovalo unknown cards (cardlimit/2) a pak zbytek doplnilo progress
// Aby porovnalo pocet unknown cards a progress cards... Pokud jedno neni vic jak pulka tak doplnit druhym
exports.getCardsToLearnAndReview = (req, res) => {
  let deckId = req.params.deckId;
  let cardArray = [];
  let cardLimit = 20;

  db.collection("decks")
    .doc(`${deckId}`)
    .get()
    .then(doc => {
      cardArray = doc.data().cardArray;

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
      if (doc.exists)
        progressCardsArray = doc.data().cardArray ? doc.data().cardArray : [];

      if (progressCardsArray.length > 0) {
        // Sorts the array
        progressCardsArray = progressCardsArray.sort(
          compareUnderstandingLevels
        );

        // Pushes 10 (=cardLimit/2) progress cards into the exportCards array
        for (let i = 0; i < progressCardsArray.length; i++) {
          if (
            progressCardsArray[i].understandingLevel < 5 &&
            exportCards.length < cardLimit / 2
          ) {
            // Finds the card in cardArray
            let exportCard = cardArray.find(
              ({ cardId }) => cardId === progressCardsArray[i].cardId
            );

            // Pushes the card to the export array
            if (exportCard) {
              exportCard.understandingLevel =
                progressCardsArray[i].understandingLevel;
              exportCards.push(exportCard);
            }
          } else break;
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

      return exportCards;
    })
    .then(exportCards => {
      res.status(200).json(exportCards);
    })
    .catch(error => console.error(error));
};
