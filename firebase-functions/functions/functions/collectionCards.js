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
    .doc(req.params.colId) // !!!
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
