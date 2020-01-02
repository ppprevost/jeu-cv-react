import reactImg from "../img/competences/react_resize.png";
import reduxImg from "../img/competences/redux_logo.png";
import graphQlImg from "../img/competences/graphql_resize.png";
import nodeJsImg from "../img/competences/nodejs.png";
import javascriptLogo from "../img/competences/javascript_logo.png";
import cssLogo from "../img/competences/css_logo.png";
import mongoDb from "../img/competences/mongo_db.png";
import typescript from "../img/competences/typescript_logo.png";
import docker from "../img/competences/docker.png";

/**
 * Keyboard
 */
export const RIGHT = 39;
export const UP = 38;
export const BOTTOM = 40;
export const LEFT = 37;
export const SPACE = 32;
export const PAUSE = 80;
export const DYNAMITE = 68;

export const windowSize = window.innerWidth;

/**
 * speed And Interval between moving
 */
export const speedPlayer = 10;
export const correctHeroWidthForCollisionWithDino = 70;
export const stopJumpingHeight = 300;
export const intervalSpeedHero = 50;
export const jumpPlayerX = 2;
export const jumpSpeed = 30;
export const dinoSpeed = 3;
export const intervalAddDino = 1700;
export const intervalSpeedDino = 16;
export const intervalBullet = 40;
export const speedBullet = 30;

/**
 * Competency
 */
export const widthCompetency = 50;
export const heightCompetency = 50;
export const competencyArray = [
  {
    img: javascriptLogo,
    type: "javascript",
    website: "https://developer.mozilla.org/fr/docs/Web/JavaScript"
  },
  {
    img: cssLogo,
    type: "css",
    website: "https://developer.mozilla.org/fr/docs/Web/JavaScript"
  },
  { img: reactImg, type: "react", website: "https://fr.reactjs.org/" },
  { img: reduxImg, type: "redux", website: "https://redux.js.org/" },
  { img: graphQlImg, type: "graphql", website: "https://graphql.org/" },
  { img: nodeJsImg, type: "node.js", website: "https://nodejs.org/en/" },
  { img: mongoDb, type: "mongoDb", website: "https://www.mongodb.com/fr" },
  { img: docker, type: "docker", website: "https://www.docker.com/" },
  {
    img: typescript,
    type: "typescript",
    website: "https://www.typescriptlang.org/"
  }
];
