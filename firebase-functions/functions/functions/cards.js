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
  let userId = req.body.uid;
  let cardArray = req.body.cardArray;
  let deckId = req.body.deckId;

  db.collection("users")
    .doc(`${userId}`)
    .collection("deckProgress")
    .doc(`${deckId}`)
    .set(
      {
        cardArray: cardArray
      },
      { merge: true }
    )
    .then(() => {
      res.status(200).json();
    })
    .catch(error => console.error(error));
};

// Sets card progress
exports.getCardsToReview = (req, res) => {
  const cardLimit = 20;
  let userId = req.params.userId;
  let deckId = req.params.deckId;

  db.collection("users")
    .doc(`${userId}`)
    .collection("deckProgress")
    .doc(`${deckId}`)
    .get()
    .then(doc => {
      let cardArray = doc.data().cardArray;

      // Sorts the array
      cardArray = cardArray.sort(compareUnderstandingLevels);

      return cardArray.slice(0, cardLimit);
    })
    .then(cardArray => {
      res.status(200).json(cardArray);
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

// TO-DO: needs error handling - if deck doesnt exist etc..
// TO-DO: Needs error handling if card is no longer in deck !! if the owner changed deck
// Gets cards that the user doesn't know yet
exports.getDeckUnknownCards = (req, res) => {
  let userId = req.params.userId;
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
        .doc(`${userId}`)
        .collection("deckProgress")
        .doc(`${deckId}`)
        .get();
    })
    .then(doc => {
      let unknownCards = findUnknownCards(cardArray, doc.data().cardArray);
      return unknownCards.slice(0, cardLimit);
    })
    .then(unknownCards => {
      res.status(200).json(unknownCards);
    })
    .catch(error => console.error(error));
};

// TO-DO: searching through array can be done more effectively (maybe with find())
function findUnknownCards(cardArray, progressCardArray) {
  let unknownCardArray = [];

  // Deletes cards that the user already knows
  progressCardArray.forEach(progressCard => {
    for (let i = 0; i < cardArray.length; i++) {
      // If the card is not already deleted
      if (cardArray[i])
        if (cardArray[i].cardId === progressCard.cardId) {
          delete cardArray[i];
        }
    }
  });

  // Pushes the remaining cards
  cardArray.forEach(card => {
    // If the card was not deleted
    if (card !== undefined) {
      unknownCardArray.push(card);
    }
  });

  return unknownCardArray;
}
