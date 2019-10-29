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
  let cardArray = req.body.cardArray;
  let deckId = req.body.deckId;

  db.collection("users")
    .doc(`${req.user.uid}`)
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
        if (exportCard) exportCards.push(exportCard);
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
  // Clones array so that the original array does not get modified
  let cardArrayClone = cardArray.slice();

  // Deletes cards that the user already knows
  progressCardArray.forEach(progressCard => {
    for (let i = 0; i < cardArrayClone.length; i++) {
      // If the card is not already deleted
      if (cardArrayClone[i])
        if (cardArrayClone[i].cardId === progressCard.cardId) {
          delete cardArrayClone[i];
        }
    }
  });

  // Pushes the remaining cards
  cardArrayClone.forEach(card => {
    // If the card was not deleted
    if (card !== undefined) {
      unknownCardArray.push(card);
    }
  });

  return unknownCardArray;
}

// NEFUNGUJE TAK JAK BY MELO
exports.getCardsToLearnAndReview = (req, res) => {
  let deckId = req.params.deckId;
  let cardArray;
  let cardLimit = 20;

  db.collection("decks")
    .doc(`${deckId}`)
    .get()
    .then(doc => {
      cardArray = doc.data().cardArray;

      console.log("Cards =>", doc.data().cardArray);
      console.log("CARDS 1 =>", cardArray);

      return db
        .collection("users")
        .doc(`${req.user.uid}`)
        .collection("deckProgress")
        .doc(`${deckId}`)
        .get();
    })
    .then(doc => {
      let outputArray = [];
      let progressCardsArray = [];
      if (doc.exists)
        progressCardsArray = doc.data().cardArray ? doc.data().cardArray : [];

      // console.log("CARDS 2 =>", cardArray);
      // console.log("PROGRESS CARDS =>", progressCardsArray);

      if (progressCardsArray.length > 0) {
        // Sorts the array
        progressCardsArray = progressCardsArray.sort(
          compareUnderstandingLevels
        );

        // Pushes 10 progress cards into the outputArray
        for (let i = 0; i < progressCardsArray.length; i++) {
          if (
            progressCardsArray[i].understandingLevel < 5 &&
            outputArray.length < cardLimit / 2
          ) {
            let exportCard = cardArray.find(function(element) {
              return element.cardId === progressCardsArray[i].cardId;
            });
            if (exportCard) outputArray.push(exportCard);
          } else break;
        }
      }

      let unknownCardsArray = findUnknownCards(cardArray, progressCardsArray);
      console.log("UNKNOWN CARDS =>", unknownCardsArray);

      // Fills the remaning space of outputArray with unknown cards
      for (let i = 0; i < unknownCardsArray.length; i++) {
        if (outputArray.length < cardLimit) {
          outputArray.push(unknownCardsArray[i]);
        } else break;
      }

      return outputArray;
    })
    .then(outputArray => {
      res.status(200).json(outputArray);
    })
    .catch(error => console.error(error));
};
