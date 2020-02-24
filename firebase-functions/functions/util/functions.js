module.exports = { compareUnderstandingLevels, findUnknownCards };

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

// Finds cards the user doesn't know
function findUnknownCards(cardArrayRef, progressCardArray) {
  let unknownCardArray = [];

  // Clones array so that the original array does not get modified
  let cardArray = JSON.parse(JSON.stringify(cardArrayRef));

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
