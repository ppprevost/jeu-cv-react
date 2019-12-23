import reactImg from "../img/competences/react_resize.png";
import graphQlImg from "../img/competences/graphql_resize.png";
import nodeJsImg from "../img/competences/nodejs.png";
import javascriptLogo from "../img/competences/javascript_logo.png";
import cssLogo from "../img/competences/css_logo.png";
import mongoDb from "../img/competences/mongo_db.png";
import typescript from "../img/competences/typescript_logo.png";
import docker from "../img/competences/docker.png";


export const windowSize = window.innerWidth;

export const speedPlayer = 10;
export const jumpPlayerX = 2;
export const jumpSpeed = 30;

export const widthCompetency = 50;
export const heightCompetency = 50;

export const dinoSpeed = 8;
export const intervalAddDino = 1700;
export const intervalSpeedDino = 170;
export const intervalSpeedHero = 50;

export const competencyArray = [
    {img:javascriptLogo, type:'javascript', website:'https://developer.mozilla.org/fr/docs/Web/JavaScript'},
    {img:cssLogo, type:'css', website:'https://developer.mozilla.org/fr/docs/Web/JavaScript'},
    {img: reactImg, type: 'react', website:"https://fr.reactjs.org/"},
    {img: graphQlImg, type: 'graphql', website:"https://graphql.org/"},
    {img: nodeJsImg, type: 'node.js', website:"https://nodejs.org/en/"},
    {img: mongoDb, type: 'mongoDb', website:"https://www.mongodb.com/fr"},
    {img: docker, type: 'docker', website:"https://www.docker.com/"},
    {img: typescript, type: 'typescript', website:"https://www.typescriptlang.org/"},
];