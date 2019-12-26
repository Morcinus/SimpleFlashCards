const { db } = require("../util/admin");

// Compares understanding levels of two progress cards
// TODO - dat nekam do util... pouzivam vickrat + i s nejakyma dalsima funkcema
function compareUnderstandingLevels(card1, card2) {
  if (card1.understandingLevel < card2.understandingLevel) {
    return -1;
  }
  if (card1.understandingLevel > card2.understandingLevel) {
    return 1;
  }
  return 0;
}

// TODO - shoud be done differently - ask Horky/research
async function loop(uid, deckArray, cardLimit) {
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

            // Limits the array
            progressCards = progressCards.slice(0, cardLimit);

            // Push the cards to export array
            progressCards.forEach(card => {
              card.deckId = deckArray[i];
              exportCards.push(card);
            });
          }

          resolve();
        })
        .catch(error => reject(error));
    }).catch(error => {
      console.log(error);
      return;
    });
  }
  return exportCards;
}
// RENAME DECKS ARRAY TO DECKS - EVERYWHERE - IT IS NOT ARRAY
async function getExportCards(decksArray) {
  let exportCards = {};

  let deckIds = Object.keys(decksArray);

  for (let i = 0; i < deckIds.length; i++) {
    await db
      .collection("decks")
      .doc(`${deckIds[i]}`)
      .get()
      .then(doc => {
        let cardArray = doc.data().cardArray;

        let exportDeckCards = [];

        // Loop through each progressCard in deck
        decksArray[deckIds[i]].forEach(progressCard => {
          let progressCardId = progressCard.cardId;

          // Finds the card in cardArray
          let exportCard = cardArray.find(
            ({ cardId }) => cardId === progressCardId
          );

          // Pushes the card to the export array
          if (exportCard) {
            exportCard.understandingLevel = progressCard.understandingLevel;
            exportDeckCards.push(exportCard);
          }
        });
        return exportDeckCards;
      })
      .then(exportDeckCards => {
        exportDeckCards.forEach(exportCard => {
          // Check if the deckId is in exportCards already
          if (exportCards.hasOwnProperty(deckIds[i])) {
            // Push card to the existing deck array
            exportCards[deckIds[i]].push(exportCard);
          } else {
            // Create a new deck array
            exportCards[deckIds[i]] = [exportCard];
          }
        });
        return;
      })
      .catch(error => console.log(error));
  }

  return exportCards;
}

// Groups cards into arrays by their deckId
function groupIntoArrays(cards) {
  let deckArrays = {};
  cards.forEach(card => {
    let cardData = {
      cardId: card.cardId,
      understandingLevel: card.understandingLevel
    };

    // Check if the deckId is in the array already
    if (deckArrays.hasOwnProperty(card.deckId)) {
      // Push card to the existing deck array
      deckArrays[card.deckId].push(cardData);
    } else {
      // Create a new deck array
      deckArrays[card.deckId] = [cardData];
    }
  });
  return deckArrays;
}

// Gets the cards for review
exports.getColCardsToReview = (req, res) => {
  const cardLimit = 5;

  db.collection("collections")
    .doc(req.params.colId)
    .get()
    .then(colDoc => {
      let deckArray = colDoc.data().deckArray;

      return loop(req.user.uid, deckArray, cardLimit);
    })
    .then(progressCards => {
      // Sorts the array by understandingLevel
      progressCards = progressCards.sort(compareUnderstandingLevels);

      // Limits the array
      progressCards = progressCards.slice(0, cardLimit);

      return progressCards;
    })
    .then(progressCards => {
      let groupedArray = groupIntoArrays(progressCards);

      return getExportCards(groupedArray);
    })
    .then(exportCards => {
      res.status(200).json({ cardArray: exportCards });
    })
    .catch(error => console.error(error));
};

exports.getColUnknownCards = (req, res) => {
  const cardLimit = 5;
  let exportCardsArray = [];

  //Get the collection doc
  db.collection("collections")
    .doc(req.params.colId)
    .get()
    .then(async colDoc => {
      // Get the array of deckIds
      let deckArray = colDoc.data().deckArray;

      let breakLoop = false;
      // Loop through decks until cardLimit reached
      for (let i = 0; i < deckArray.length; i++) {
        if (breakLoop) {
          break;
        } else {
          let progressCards = [];

          // Find user deck progress
          await db
            .collection("users")
            .doc(req.user.uid)
            .collection("deckProgress")
            .doc(deckArray[i])
            .get()
            .then(doc => {
              if (doc.exists) {
                // If user has some progress, find unknown cards
                progressCards = doc.data().cardArray;
                return db
                  .collection("decks")
                  .doc(deckArray[i])
                  .get()
                  .then(doc => {
                    let cardArray = doc.data().cardArray;
                    let unknownCards = findUnknownCards(
                      cardArray,
                      progressCards
                    );
                    return unknownCards;
                  })
                  .catch(error => console.error(error));
              } else {
                // Else all cards are unknown => just return all cards
                return db
                  .collection("decks")
                  .doc(deckArray[i])
                  .get()
                  .then(doc => {
                    let cardArray = doc.data().cardArray;
                    return cardArray;
                  })
                  .catch(error => console.error(error));
              }
            })
            .then(cardArray => {
              // Fill exportCardsArray until cardLimit reached
              if (cardArray.length + exportCardsArray.length < cardLimit) {
                // Push all cards from card array
                for (let i = 0; i < cardArray.length; i++) {
                  exportCardsArray.push(cardArray[i]);
                }
                // Continue the loop
                return;
              } else if (
                cardArray.length + exportCardsArray.length >=
                cardLimit
              ) {
                for (let i = 0; i <= cardLimit - exportCardsArray.length; i++) {
                  // Finished, push cards & break loop
                  exportCardsArray.push(cardArray[i]);
                }
                // Break the loop
                breakLoop = true;
                return;
              }
            })
            .catch(error => console.error(error));
        }
      }

      return exportCardsArray;
    })
    .then(exportCards => {
      res.status(200).json({ cardArray: exportCards });
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