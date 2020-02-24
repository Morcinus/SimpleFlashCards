const { db } = require("../util/admin");
const { compareUnderstandingLevels, findUnknownCards } = require("../util/functions");

// Finds and returns all progresscards of a collection
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

// Gets export cards by the grouped progressCards object
async function getExportCards(deckArrays) {
  let exportCards = [];

  let deckIds = Object.keys(deckArrays);

  // Get each deck
  for (let i = 0; i < deckIds.length; i++) {
    await db
      .collection("decks")
      .doc(`${deckIds[i]}`)
      .get()
      .then(doc => {
        let cardArray = doc.data().cardArray;

        // Loop through each progressCard in deck
        deckArrays[deckIds[i]].forEach(progressCard => {
          let progressCardId = progressCard.cardId;

          // Finds the card in cardArray
          let exportCard = cardArray.find(({ cardId }) => cardId === progressCardId);

          // Pushes the card to the export array
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

// Groups cards into arrays by their deckId
function groupIntoArrays(cardsRef) {
  // Clone array (deep clone)
  let cards = JSON.parse(JSON.stringify(cardsRef));

  let deckArrays = {};
  if (cards.length > 0) {
    cards.forEach(card => {
      let deckId = card.deckId;

      // Check if the deckId is in the array already
      if (deckArrays.hasOwnProperty(deckId)) {
        // Push card to the existing deck array
        delete card.deckId;
        deckArrays[deckId].push(card);
      } else {
        // Create a new deck array
        delete card.deckId;
        deckArrays[deckId] = [card];
      }
    });
  }

  return deckArrays;
}

// Gets the cards for review
exports.getColCardsToReview = (req, res) => {
  const cardLimit = 20;

  db.collection("collections")
    .doc(req.params.colId)
    .get()
    .then(colDoc => {
      let deckArray = colDoc.data().deckArray;

      return getProgressCards(req.user.uid, deckArray);
    })
    .then(progressCards => {
      // Sorts the array by understandingLevel
      progressCards = progressCards.sort(compareUnderstandingLevels);

      // Limits the array
      progressCards = progressCards.slice(0, cardLimit);

      return progressCards;
    })
    .then(async progressCards => {
      let groupedArray = groupIntoArrays(progressCards);

      let exportCards = await getExportCards(groupedArray);

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
                    let unknownCards = findUnknownCards(cardArray, progressCards);
                    return unknownCards;
                  })
                  .catch(err => {
                    console.error(err);
                    return res.status(500).json({ errorCode: err.code });
                  });
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
                  .catch(err => {
                    console.error(err);
                    return res.status(500).json({ errorCode: err.code });
                  });
              }
            })
            .then(cardArray => {
              // Fill exportCardsArray from cardArray until cardLimit reached
              if (cardArray.length + exportCardsArray.length < cardLimit) {
                // Push all cards from card array
                for (let j = 0; j < cardArray.length; j++) {
                  let card = cardArray[j];
                  card.deckId = deckArray[i];
                  exportCardsArray.push(card);
                }
                // Continue the loop
                return;
              } else if (cardArray.length + exportCardsArray.length >= cardLimit) {
                for (let j = 0; j <= cardLimit - exportCardsArray.length; j++) {
                  // Finished, push cards & break loop
                  let card = cardArray[j];
                  card.deckId = deckArray[i];
                  exportCardsArray.push(card);
                }
                // Break the loop
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

exports.getColCardsToLearnAndReview = (req, res) => {
  const cardLimit = 10;
  let unknownCardsLimit = cardLimit / 2;
  let progressCards = [];
  let exportCardsArray = [];
  let deckArray = [];

  //Get the collection doc
  db.collection("collections")
    .doc(req.params.colId)
    .get()
    .then(colDoc => {
      // Get the array of deckIds
      deckArray = colDoc.data().deckArray;

      return getProgressCards(req.user.uid, deckArray);
    })
    .then(unsortedProgressCards => {
      //console.log(`unsortedProgressCards: ${unsortedProgressCards}`);
      // Sorts the array by understandingLevel
      progressCards = unsortedProgressCards.sort(compareUnderstandingLevels);
      console.log("ProgressCards0: ", progressCards);
      // Update the unknownCardsLimit if there is not enough progressCards
      if (progressCards.length < Math.round(cardLimit / 2)) {
        // upravit cardlimit
        unknownCardsLimit = cardLimit - progressCards.length; // +1???
        // console.log(`unknownCardsLimit (${unknownCardsLimit}) = (${cardLimit}) - (${progressCards.length})`);
      }
      return groupIntoArrays(progressCards);
    })
    .then(async groupedProgressCards => {
      console.log("ProgressCards0,1: ", groupedProgressCards);
      console.log("ProgressCards0,3: ", progressCards);
      let breakLoop = false;

      // Loop through decks until cardLimit reached
      for (let i = 0; i < deckArray.length; i++) {
        if (breakLoop) {
          break;
        } else {
          // Get progress cards of one deck
          let progressCards2 = groupedProgressCards[deckArray[i]];

          // Find unknown cards
          await new Promise((resolve, reject) => {
            // If user has some progress, find unknown cards
            if (progressCards2) {
              return db
                .collection("decks")
                .doc(deckArray[i])
                .get()
                .then(doc => {
                  let cardArray = doc.data().cardArray;
                  let unknownCards = findUnknownCards(cardArray, progressCards2);
                  resolve(unknownCards);
                })
                .catch(error => reject(error));
            } else {
              // Else all cards are unknown => just return all cards
              return db
                .collection("decks")
                .doc(deckArray[i])
                .get()
                .then(doc => {
                  let cardArray = doc.data().cardArray;
                  resolve(cardArray);
                })
                .catch(error => reject(error));
            }
          })
            .then(cardArray => {
              // Fill exportCardsArray with unknownCards until unknownCardsLimit reached
              if (cardArray.length + exportCardsArray.length < unknownCardsLimit) {
                // Push all cards from card array
                for (let j = 0; j < cardArray.length; j++) {
                  let card = cardArray[j];
                  card.deckId = deckArray[i];
                  exportCardsArray.push(card);
                }
                // Continue the loop
                return;
              } else if (cardArray.length + exportCardsArray.length >= unknownCardsLimit) {
                let exportCardsLength = exportCardsArray.length;
                for (let j = 0; j < unknownCardsLimit - exportCardsLength; j++) {
                  // Finished, push cards & break loop
                  let card = cardArray[j];
                  card.deckId = deckArray[i];
                  exportCardsArray.push(card);
                }
                // Break the loop
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
      console.log("ProgressCards0,2: ", progressCards);
    })
    .then(async () => {
      // Fill the remaining space with remaining progressCards
      if (exportCardsArray.length < cardLimit) {
        let progressCardsLimit = cardLimit - exportCardsArray.length; //+1???

        console.log(`progressCardsLimit (${progressCardsLimit}) =  ${cardLimit} - ${exportCardsArray.length}`);
        let slicedProgressCards = progressCards.slice(0, progressCardsLimit);
        console.log("ProgressCards1: ", slicedProgressCards);
        let groupedProgressCards = groupIntoArrays(slicedProgressCards);
        console.log("ProgressCards2: ", groupedProgressCards);
        // Get exportCards and push them to exportCardsArray
        await getExportCards(groupedProgressCards).then(exportCards => {
          exportCards.forEach(exportCard => {
            exportCardsArray.push(exportCard);
          });
        });
      }
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

// Sets card progress
exports.setColCardsProgress = (req, res) => {
  let newCardArray = req.body.cardArray;

  let deckIds = Object.keys(newCardArray);

  new Promise(async (resolve, reject) => {
    let batch = db.batch();
    for (let i = 0; i < deckIds.length; i++) {
      let progressDocRef = db
        .collection("users")
        .doc(req.user.uid)
        .collection("deckProgress")
        .doc(deckIds[i]);

      await progressDocRef.get().then(doc => {
        let cardArray = [];
        if (doc.exists) {
          cardArray = doc.data().cardArray ? doc.data().cardArray : [];
        }

        // Update the cardArray
        newCardArray[deckIds[i]].forEach(newCard => {
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
          batch.update(progressDocRef, { cardArray: cardArray });
        } else {
          batch.set(progressDocRef, {
            deckId: deckIds[i], // Is needed for collectionGroup - progress removing
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
