import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useReducer,
  useState
} from "react";
import {
  ADD_PLAYER,
  SET_SOUND,
  MOVE_RIGHT,
  MOVE_LEFT,
  ADD_DINO,
  IDLE,
  IS_CROUCHING,
  MOVE_DINO,
  DELETE_DINO,
  COLLISION,
  STOP_HURTING,
  LAND_PLAYER,
  STOP_SHOOTING,
  JUMP,
  KILL_DINO
} from "../constants";
import {
  competencyArray,
  heightCompetency,
  widthCompetency
} from "../constants/contants";
import watchOutSound from "../sound/OOT_Navi_WatchOut1.mp3";
import shotSound from "../sound/fusil.mp3";
import winner from "../sound/winner.mp3";
import { Competency } from "../components/Competency";
import { IHero, initHeroes } from "../data/player";
import { IPropsDino } from "../components/Dinosaurs";
import { IBulletProps } from "../components/Bullet";
import { bulletInit, dynamiteInit } from "../data/bullet";
import hornSound from "../sound/the-price-is-right-losing-horn.mp3";
import {
  competencyFixed,
  playSoundRampage,
  repercutPositionHero
} from "../helpers/main_helpers";

type ActionType = {
  type: string;
  [key: string]: any;
};

type GameType = "game" | "tutorial";

type State = {
  intro: boolean;
  gameType: GameType | null;
  sound: boolean;
  player: IHero;
  dino: IPropsDino[];
  idDino: number;
  direction: string;
  win: boolean;
  idBullet: number;
  target: number;
  gameOver: boolean;
  pause: boolean;
  competency: any[];
  bullets: IBulletProps[];
  chrono: { minute: number; second: number };
};

const UserContext = createContext<any>([]);

export const initialState = {
  intro: true,
  gameType: false,
  direction: "right",
  sound: true,
  player: null,
  dino: [],
  pause: false,
  bullets: [],
  win: false,
  idDino: 0,
  target: 0,
  chrono: { minute: 0, second: 0 },
  gameOver: false,
  competency: [],
  idBullet: 0
};
const watchSound = new Audio(watchOutSound);
const rifleSound = new Audio(shotSound);
const winnerSound = new Audio(winner);
const hornSoundMP3 = new Audio(hornSound);

const allItemCatched = (competency: Competency[]) => {
  for (let competence of competency) {
    if (!competence.catched) {
      return false;
    }
  }
  return true;
};

const findDino = (action: ActionType) => {
  return ({ id }: IPropsDino) => action.payload.id === id;
};

export const reducer = (state: State, action: ActionType) => {
  switch (action.type) {
    case "START_GAME":
      initHeroes.email = action.payload.email;
      initHeroes.name = action.payload.name;
      state.gameType = "game";
      state.intro = false;
      return { ...state };

    case SET_SOUND:
      return { ...state, sound: !state.sound };
    case "SET_PAUSE":
      if (state.player) {
        // if pause you have to prevent shooting behavior
        if(action.payload){
          return {...state,pause:false}
        }
        return {
          ...state,
          player: {
            ...state.player,
            position: {
              ...state.player.position,
              isDynamiting: false,
              isShooting: false
            }
          },
          sound: state.pause,
          pause: !state.pause
        };
      }
      return { ...state };
    case ADD_PLAYER:
      return {
        ...state,
        player: { ...initHeroes }
      };
    case MOVE_RIGHT:
      state.direction = "right";
      return repercutPositionHero(state, "isRunning", action.stop);
    case MOVE_LEFT:
      state.direction = "left";
      return repercutPositionHero(state, "isRunningLeft", action.stop);
    case IDLE:
      return repercutPositionHero(state, "isIdle");
    case IS_CROUCHING:
      return repercutPositionHero(state, "isCrouching", action.stop);
    case "IS_DYNAMITING":
      if (state.player && state.player.dynamite > 0) {
        state.idBullet++;
        state.player.dynamite -= 1;
        console.log(dynamiteInit);
        state.bullets = [
          ...state.bullets,
          { ...dynamiteInit, id: state.idBullet }
        ];
        return repercutPositionHero(state, "isDynamiting");
      }
      return { ...state };
    case "SHOOT":
      if (!state.win && !state.pause) {
        state.idBullet++;
        const newBullet = { ...bulletInit, id: state.idBullet };
        state.bullets = [...state.bullets, newBullet];
        if (state.sound) {
          rifleSound.currentTime = 0;
          rifleSound.volume = 0.2;
          rifleSound.play();
        } else {
          rifleSound.pause();
        }
        return repercutPositionHero(state, "isShooting");
      }
      break;
    case STOP_SHOOTING:
      return repercutPositionHero(state, "isShooting", true);
    case "STOP_JUMPING":
      if (state.player) {
        state.player.stopJump = false;
      }
      return repercutPositionHero(state, "isJumping", true);
    case "STOP_BULLET":
      state.bullets = state.bullets.filter(
        ({ id }: IBulletProps) => action.payload.id !== id
      );
      if (action.payload.type === "dynamite") {
        return repercutPositionHero(state, "isDynamiting", true);
      }
      return { ...state };
    case "ANIMATE_PLAYER":
      return {
        ...state,
        player: { ...state.player, x: action.x, y: action.y ? action.y : {} }
      };
    case LAND_PLAYER:
      if (state.player) {
        state.player.stopJump = true;
      }
      return { ...state };
    case STOP_HURTING:
      console.log("stop hurt");
      if (state.player && state.player.health > 0) {
        return repercutPositionHero(state, "isHurting", true);
      }
      return { ...state };
    case JUMP:
      return repercutPositionHero(state, "isJumping");
    case ADD_DINO:
      const newDino = { ...action.newDino };
      state.idDino += 1;
      newDino.alive = true;
      newDino.speed = Math.round(Math.random() * 5);
      newDino.id = state.idDino;
      return { ...state, dino: [...state.dino, newDino] };
    case MOVE_DINO:
      let actualDino = state.dino.findIndex(findDino(action));
      if (actualDino >= 0) {
        state.dino[actualDino].x = action.payload.x;
      }
      return { ...state };
    case DELETE_DINO:
      let actualDinoToDelete = state.dino.findIndex(findDino(action));
      state.dino.splice(actualDinoToDelete, 1);
      return { ...state };

    case "RAMPAGE":
      const existingDino = state.dino.filter(elem => elem.alive);
      playSoundRampage(existingDino.length, state.sound);
      const newDinoArray = state.dino.map(dinosaur => {
        return { ...dinosaur, alive: false };
      });
      return { ...state, dino: newDinoArray };
    case KILL_DINO:
      let actualDinoToKill = state.dino.find(findDino(action));
      let actualDinoToKillIndex = state.dino.findIndex(findDino(action));
      if (actualDinoToKill) {
        state.dino[actualDinoToKillIndex].alive = false;
        if (state.player) {
          state.player.score += 10;
          state.target += 1;
          if (
            state.target > 0 &&
            state.target % 2 === 0 &&
            competencyArray[state.competency.length]
          ) {
            if (state.sound) {
              watchSound.currentTime = 0;
              watchSound.volume = 0.7;
              watchSound.play();
            } else {
              watchSound.pause();
            }
            const newCompetency = {
              avatar: competencyArray[state.competency.length].img,
              type: competencyArray[state.competency.length].type,
              website: competencyArray[state.competency.length].website,
              catched: false,
              x: competencyFixed(actualDinoToKill.x, widthCompetency),
              y: actualDinoToKill.y + heightCompetency
            };
            return {
              ...state,
              competency: [...state.competency, newCompetency]
            };
          }
        }
      }
      return { ...state };
    case COLLISION:
      if (!state.player.position.isHurting) {
        const hurtedPlayerState = repercutPositionHero(state, "isHurting");
        if (hurtedPlayerState.player && hurtedPlayerState.player.health > 0) {
          hurtedPlayerState.player.health -= 10;
        }
        if (
          hurtedPlayerState &&
          hurtedPlayerState.player &&
          hurtedPlayerState.player.health <= 0
        ) {
          hornSoundMP3.play();
          hurtedPlayerState.gameOver = true;
          hurtedPlayerState.player = null;
        }
        return { ...hurtedPlayerState };
      }
      return { ...state };
    case "ADD_COMPETENCY":
      const newCompetency = [...state.competency, action.payload.newCompetency];
      return { ...state, competency: newCompetency };
    case "GET_COMPETENCY":
      const catchedCompetency = state.competency.map(comp => {
        if (comp.type === action.payload.newComp) {
          comp.catched = true;
        }

        if (
          state.player &&
          competencyArray.length === state.competency.length &&
          allItemCatched(state.competency)
        ) {
          if (state.sound) {
            winnerSound.play();
          }
          state.win = true;
        }
        return comp;
      });
      return { ...state, competency: catchedCompetency };
    case "ADD_TIME":
      if (state.chrono.second < 60) {
        state.chrono.second += 1;
      }
      if (state.chrono.second === 60) {
        state.chrono.second = 0;
        state.chrono.minute += 1;
      }
      return { ...state };
    case "RESET_GAME":
      console.log("reset");
      const init = { game: "game", player: { ...initHeroes } };
      // @ts-ignore
      state = { ...initialState, ...init };
      return { ...state };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const GameProvider: FunctionComponent = ({ children }) => {
  const [state, setState] = useState({ isLoaded: false });
  // @ts-ignore
  const contextValue = useReducer(reducer, initialState);
  useEffect(() => {
    setState({ isLoaded: true });
  }, []);
  return (
    <UserContext.Provider value={contextValue}>
      {state.isLoaded && children}
    </UserContext.Provider>
  );
};

export const useGameData = (): [State, any] => useContext(UserContext);

export { UserContext, GameProvider };

export default GameProvider;
