import React from "react";
import { Link } from "react-router-dom";

// Material UI
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import MenuBook from "@material-ui/icons/MenuBook";
import FitnessCenter from "@material-ui/icons/FitnessCenter";

// Other
import DEFAULT_DECK_IMG_URL from "../util/other";
import { DEFAULT_COLLECTION_IMG_URL } from "../util/other";

/**
 * @module functions
 * @category util
 */

/**
 * Vytvoří markup s obrázky a názvy balíčků.
 * @function renderDecks
 * @param {Array} deckArray - Pole balíčků.
 * @returns {Array} Pole markupu balíčků.
 */

export function renderDecks(deckArray) {
  let markup = [];

  const textStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "145px"
  };

  for (let i = 0; i < deckArray.length; i++) {
    markup.push(
      <Grid item key={deckArray[i].deckId}>
        <Card
          variant="outlined"
          style={{
            width: "145px",
            height: "170px",
            marginRight: "20px",
            backgroundColor: "#fff0c7"
          }}
        >
          <CardActionArea style={{ width: "100%", height: "100%", textAlign: "center" }} component={Link} to={`/deck/${deckArray[i].deckId}`}>
            <CardMedia style={{ width: "100%", height: "100%" }} image={deckArray[i].deckImage ? deckArray[i].deckImage : DEFAULT_DECK_IMG_URL}></CardMedia>
          </CardActionArea>
        </Card>
        <Typography style={textStyle}>{deckArray[i].deckName}</Typography>
      </Grid>
    );
  }

  return markup;
}

/**
 * Vytvoří markup s obrázky a názvy kolekcí.
 * @function renderCollections
 * @param {Array} collectionArray - Pole kolekcí.
 * @returns {Array} Pole markupu kolekcí.
 */
export function renderCollections(collectionArray) {
  let markup = [];

  const textStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "145px"
  };

  for (let i = 0; i < collectionArray.length; i++) {
    markup.push(
      <Grid item key={collectionArray[i].colId}>
        <Card
          variant="outlined"
          style={{
            width: "145px",
            height: "170px",
            marginRight: "20px"
          }}
        >
          <CardActionArea style={{ width: "100%", height: "100%" }} component={Link} to={`/collection/${collectionArray[i].colId}`}>
            <CardMedia style={{ width: "100%", height: "100%" }} image={DEFAULT_COLLECTION_IMG_URL}></CardMedia>
          </CardActionArea>
        </Card>
        <Typography style={textStyle}>{collectionArray[i].colName}</Typography>
      </Grid>
    );
  }

  return markup;
}

/**
 * Vytvoří markup tlačítek na učení karet dané kolekce.
 * @function colLearnButtons
 * @param {string} colId - ID kolekce.
 * @returns Markup tlačítek.
 */
export function colLearnButtons(colId) {
  const cardActionStyle = {
    width: "100%",
    height: "100%",
    textAlign: "center"
  };
  const iconStyle = {
    fontSize: 75,
    color: "#37474f"
  };
  const textStyle = {
    fontWeight: "bold",
    color: "#37474f"
  };
  const smallCardStyle = {
    width: "175px",
    height: "175px",
    backgroundColor: "#bff27e"
  };
  const largeCardStyle = {
    width: "200px",
    height: "200px",
    backgroundColor: "#91cc47"
  };
  const linkStyle = {
    textDecoration: "none"
  };

  return (
    <React.Fragment>
      <Grid item>
        <Card variant="outlined" style={smallCardStyle}>
          <Link to={`/studyCollection/${colId}?lessonType=learn`} style={linkStyle}>
            <CardActionArea style={cardActionStyle}>
              <MenuBook style={iconStyle}></MenuBook>
              <Typography style={textStyle}>LEARN NEW</Typography>
            </CardActionArea>
          </Link>
        </Card>
      </Grid>
      <Grid item>
        <Card variant="outlined" style={largeCardStyle}>
          <Link to={`/studyCollection/${colId}?lessonType=study`} style={linkStyle}>
            <CardActionArea style={cardActionStyle}>
              <MenuBook style={iconStyle}></MenuBook>
              <FitnessCenter style={iconStyle}></FitnessCenter>
              <Typography style={textStyle}>LEARN & REVIEW</Typography>
            </CardActionArea>
          </Link>
        </Card>
      </Grid>
      <Grid item>
        <Card variant="outlined" style={smallCardStyle}>
          <Link to={`/studyCollection/${colId}?lessonType=review`} style={linkStyle}>
            <CardActionArea style={cardActionStyle}>
              <FitnessCenter style={iconStyle}></FitnessCenter>
              <Typography style={textStyle}>REVIEW OLD</Typography>
            </CardActionArea>
          </Link>
        </Card>
      </Grid>
    </React.Fragment>
  );
}

/**
 * Vytvoří markup tlačítek na učení karet daného balíčku.
 * @function deckLearnButtons
 * @param {string} deckId - ID balíčku.
 * @returns Markup tlačítek.
 */
export function deckLearnButtons(deckId) {
  const cardActionStyle = {
    width: "100%",
    height: "100%",
    textAlign: "center"
  };
  const iconStyle = {
    fontSize: 75,
    color: "#37474f"
  };
  const textStyle = {
    fontWeight: "bold",
    color: "#37474f"
  };
  const smallCardStyle = {
    width: "175px",
    height: "175px",
    backgroundColor: "#bff27e"
  };
  const largeCardStyle = {
    width: "200px",
    height: "200px",
    backgroundColor: "#91cc47"
  };
  const linkStyle = {
    textDecoration: "none"
  };

  return (
    <React.Fragment>
      <Grid item>
        <Card variant="outlined" style={smallCardStyle}>
          <Link to={`/studyDeck/${deckId}?lessonType=learn`} style={linkStyle}>
            <CardActionArea style={cardActionStyle}>
              <MenuBook style={iconStyle}></MenuBook>
              <Typography style={textStyle}>LEARN NEW</Typography>
            </CardActionArea>
          </Link>
        </Card>
      </Grid>
      <Grid item>
        <Card variant="outlined" style={largeCardStyle}>
          <Link to={`/studyDeck/${deckId}?lessonType=study`} style={linkStyle}>
            <CardActionArea style={cardActionStyle}>
              <MenuBook style={iconStyle}></MenuBook>
              <FitnessCenter style={iconStyle}></FitnessCenter>
              <Typography style={textStyle}>LEARN & REVIEW</Typography>
            </CardActionArea>
          </Link>
        </Card>
      </Grid>
      <Grid item>
        <Card variant="outlined" style={smallCardStyle}>
          <Link to={`/studyDeck/${deckId}?lessonType=review`} style={linkStyle}>
            <CardActionArea style={cardActionStyle}>
              <FitnessCenter style={iconStyle}></FitnessCenter>
              <Typography style={textStyle}>REVIEW OLD</Typography>
            </CardActionArea>
          </Link>
        </Card>
      </Grid>
    </React.Fragment>
  );
}

/**
 * Vytvoří markup kartičky při studování.
 * @function flashCard
 * @param {Object} card - Objekt dané karty.
 * @param {boolean} cardSide - Určuje, jak je otočená kartička. Pro hodnotu false uživatel vidí přední stranu, pro hodnotu true vidí zadní.
 * @param {function} cardFlipFunciton - Funkce, která při kliknutí na kartičku kartu otočí.
 * @returns Markup kartičky.
 */
export function flashCard(card, cardSide, cardFlipFunciton) {
  return (
    <Card
      variant="outlined"
      style={{
        width: "350px",
        height: "350px",
        backgroundColor: "#fff0c7"
      }}
    >
      <CardActionArea
        style={{
          width: "100%",
          height: "100%",
          textAlign: "center"
        }}
        onClick={cardFlipFunciton}
      >
        <Typography variant="h4" style={{ color: "#37474f" }}>
          {!cardSide ? (card ? card.body1 : "loading...") : card ? card.body2 : "loading..."}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

/**
 * Vytvoří markup pro všechny kartičky, které jsou v daném balíčku.
 * @function renderFlashCards
 * @param {Array<Object>} cardArray - Pole kartiček daného balíčku.
 * @param {Array<boolean>} cardSides - Pole které určuje, jak jsou jednotlivé kartičky otočené. Pro hodnotu false uživatel vidí přední stranu, pro hodnotu true vidí zadní.
 * @param {function} flipCardFunction - Funkce, která při kliknutí na kartičku kartu otočí.
 * @returns {Array} Markup kartiček.
 */
export function renderFlashCards(cardArray, cardSides, flipCardFunction) {
  let markup = [];

  const frontCardStyle = {
    width: "145px",
    height: "170px",
    marginRight: "20px",
    backgroundColor: "#fff0c7"
  };

  const backCardStyle = {
    width: "145px",
    height: "170px",
    marginRight: "20px",
    backgroundColor: "#ffe499"
  };

  for (let i = 0; i < cardArray.length; i++) {
    markup.push(
      <Grid item key={cardArray[i].cardId}>
        <Card variant="outlined" style={cardSides[i] ? backCardStyle : frontCardStyle}>
          <CardActionArea style={{ width: "100%", height: "100%", textAlign: "center" }} onClick={() => flipCardFunction(i)}>
            <Typography variant="h6" style={{ color: "#37474f" }}>
              {cardSides[i] ? cardArray[i].body2 : cardArray[i].body1}
            </Typography>
          </CardActionArea>
        </Card>
      </Grid>
    );
  }

  return markup;
}
