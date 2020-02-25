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
import defaultDeckImageUrl from "../util/other";
import { collectionDefaultImgUrl } from "../util/other";

/**
 * @module functions
 * @category util
 */

/**
 * Vytvoří markup s obrázky a názvy balíčků.
 * @function renderDecks
 * @param {Array} deckArray - Pole balíčků
 * @returns Markup balíčků
 */

export function renderDecks({ deckArray }) {
  let markup = [];

  for (let i = 0; i < deckArray.length; i++) {
    markup.push(
      <Grid item>
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
            <CardMedia style={{ width: "100%", height: "100%" }} image={deckArray[i].deckImage ? deckArray[i].deckImage : defaultDeckImageUrl}></CardMedia>
          </CardActionArea>
        </Card>
        <Typography>{deckArray[i].deckName}</Typography>
      </Grid>
    );
  }

  return markup;
}

/**
 * Vytvoří markup s obrázky a názvy kolekcí.
 * @function renderCollections
 * @param {Array} collectionArray - Pole kolekcí
 * @returns Markup kolekcí
 */
export function renderCollections({ collectionArray }) {
  let markup = [];

  for (let i = 0; i < collectionArray.length; i++) {
    markup.push(
      <Grid item>
        <Card
          variant="outlined"
          style={{
            width: "145px",
            height: "170px",
            marginRight: "20px"
          }}
        >
          <CardActionArea style={{ width: "100%", height: "100%" }} component={Link} to={`/collection/${collectionArray[i].colId}`}>
            <CardMedia style={{ width: "100%", height: "100%" }} image={collectionDefaultImgUrl}></CardMedia>
          </CardActionArea>
        </Card>
        <Typography>{collectionArray[i].colName}</Typography>
      </Grid>
    );
  }

  return markup;
}

/**
 * Vytvoří markup tlačítek na učení karet dané kolekce.
 * @function colLearnButtons
 * @param {string} colId - ID kolekce
 * @returns Markup tlačítek
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
    marginRight: "20px",
    backgroundColor: "#bff27e"
  };
  const largeCardStyle = {
    width: "200px",
    height: "200px",
    marginRight: "20px",
    backgroundColor: "#91cc47"
  };
  const linkStyle = {
    textDecoration: "none"
  };

  return (
    <Grid container direction="row" justify="space-evenly" alignItems="center">
      <Card variant="outlined" style={smallCardStyle}>
        <Link to={`/studyCollection/${colId}?lessonType=learn`} style={linkStyle}>
          <CardActionArea style={cardActionStyle}>
            <MenuBook style={iconStyle}></MenuBook>
            <Typography style={textStyle}>LEARN NEW</Typography>
          </CardActionArea>
        </Link>
      </Card>
      <Card variant="outlined" style={largeCardStyle}>
        <Link to={`/studyCollection/${colId}?lessonType=study`} style={linkStyle}>
          <CardActionArea style={cardActionStyle}>
            <MenuBook style={iconStyle}></MenuBook>
            <FitnessCenter style={iconStyle}></FitnessCenter>
            <Typography style={textStyle}>LEARN & REVIEW</Typography>
          </CardActionArea>
        </Link>
      </Card>
      <Card variant="outlined" style={smallCardStyle}>
        <Link to={`/studyCollection/${colId}?lessonType=review`} style={linkStyle}>
          <CardActionArea style={cardActionStyle}>
            <FitnessCenter style={iconStyle}></FitnessCenter>
            <Typography style={textStyle}>REVIEW OLD</Typography>
          </CardActionArea>
        </Link>
      </Card>
    </Grid>
  );
}

/**
 * Vytvoří markup tlačítek na učení karet daného balíčku.
 * @function deckLearnButtons
 * @param {string} deckId - ID balíčku
 * @returns Markup tlačítek
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
    marginRight: "20px",
    backgroundColor: "#bff27e"
  };
  const largeCardStyle = {
    width: "200px",
    height: "200px",
    marginRight: "20px",
    backgroundColor: "#91cc47"
  };
  const linkStyle = {
    textDecoration: "none"
  };

  return (
    <Grid container direction="row" justify="space-evenly" alignItems="center">
      <Card variant="outlined" style={smallCardStyle}>
        <Link to={`/studyDeck/${deckId}?lessonType=learn`} style={linkStyle}>
          <CardActionArea style={cardActionStyle}>
            <MenuBook style={iconStyle}></MenuBook>
            <Typography style={textStyle}>LEARN NEW</Typography>
          </CardActionArea>
        </Link>
      </Card>
      <Card variant="outlined" style={largeCardStyle}>
        <Link to={`/studyDeck/${deckId}?lessonType=study`} style={linkStyle}>
          <CardActionArea style={cardActionStyle}>
            <MenuBook style={iconStyle}></MenuBook>
            <FitnessCenter style={iconStyle}></FitnessCenter>
            <Typography style={textStyle}>LEARN & REVIEW</Typography>
          </CardActionArea>
        </Link>
      </Card>
      <Card variant="outlined" style={smallCardStyle}>
        <Link to={`/studyDeck/${deckId}?lessonType=review`} style={linkStyle}>
          <CardActionArea style={cardActionStyle}>
            <FitnessCenter style={iconStyle}></FitnessCenter>
            <Typography style={textStyle}>REVIEW OLD</Typography>
          </CardActionArea>
        </Link>
      </Card>
    </Grid>
  );
}
