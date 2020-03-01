module.exports = { compareUnderstandingLevels, findUnknownCards };

/**
 * @module functions
 * @category Funkce
 */

/**
 * @function compareUnderstandingLevels
 * @description Porovná úroveň pochopení dané karty.
 * @param {Object} card1 - Karta, která má být porovnána.
 * @param {Object} card2 - Karta, která má být porovnána.
 * @returns {number} Vrací hodnoty -1, 0, 1 podle toho, jestli má první karta nižší, stejnou nebo vyšší úroveň porozumění, než karta druhá.
 */
function compareUnderstandingLevels(card1, card2) {
  if (card1.understandingLevel < card2.understandingLevel) {
    return -1;
  }
  if (card1.understandingLevel > card2.understandingLevel) {
    return 1;
  }
  return 0;
}

/**
 * @function findUnknownCards
 * @description Srovná pole karet a pole pokrokových karet a vybere z pole karet karty, které uživatel ještě nezná.
 * @param {Array<Object>} cardArray - Pole karet.
 * @param {Array<Object>} progressCardArray - Pole pokrokových karet.
 * @returns {Array<Object>} Vrací pole karet, které uživatel nezná.
 */
function findUnknownCards(cardArray, progressCardArray) {
  let unknownCardArray = [];

  // Klonování cardArray (deep clone), aby se nepřepisoval cardArray.
  let cards = JSON.parse(JSON.stringify(cardArray));

  // Smaže v cards poli karty, které uživatel už zná (tj. které jsou v progressCardArray).
  progressCardArray.forEach(progressCard => {
    for (let i = 0; i < cards.length; i++) {
      // Pokud karta není smazaná.
      if (cards[i])
        if (cards[i].cardId === progressCard.cardId) {
          delete cards[i];
        }
    }
  });

  // Vloží zbylé karty (tj. ty, které uživatel nezná) do unknownCardArray.
  cards.forEach(card => {
    // Pokud nebyla karta smazána.
    if (typeof card !== undefined) {
      unknownCardArray.push(card);
    }
  });

  return unknownCardArray;
}
