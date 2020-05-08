import { IHero, initHeroes } from "../data/player";
import {
  ADD_COMPETENCY,
  ADD_PLAYER,
  ADD_TIME,
  GET_COMPETENCY,
  RESET_GAME,
  SET_SOUND
} from "../constants";
import {
  debounce,
  generateUniqueID,
  repercutPositionHero
} from "../helpers/main_helpers";
import { IBulletProps } from "../components/Bullet";
import {
  competencyArray,
  maskConstant,
} from "../constants/contants";
import winner from "../sound/winner.mp3";
import { Competency } from "../components/Competency";
import { IPropsDino } from "../components/Virus";
import { AnyElement } from "../components/Pangolin";

export type ActionType = {
  type: string;
  [key: string]: any;
};

export interface ExistingHero extends State {
  player: IHero;
}

type GameType = "game" | "tutorial";

export interface Friend {
  id: string;
  width: number;
  height: number;
  isSick: boolean;
  x: number;
  y: number;
}

export interface AliveElement extends AnyElement {
  hurt?: boolean;
}

export type State = {
  intro: boolean;
  gameType: GameType | null;
  sound: boolean;
  player: IHero | null;
  misc: any;
  dino: IPropsDino[];
  idDino: number;
  friend: Friend;
  direction: "left" | "right";
  win: boolean;
  idBullet: number;
  pangolin: { [key: string]: AliveElement };
  target: number;
  gameOver: boolean;
  windowInfo: any;
  pause: boolean;
  bonus: any;
  competency: Competency[];
  bullets: IBulletProps[];
  chrono: { minute: number; second: number };
};

const winnerSound = new Audio(winner);

export const initialState: State = {
  windowInfo: {},
  intro: false,
  gameType: "game",
  direction: "right",
  sound: true,
  player: null,
  dino: [],
  pause: false,
  bullets: [],
  misc: {},
  pangolin: {},
  bonus: {},
  win: false,
  friend: {} as Friend,
  idDino: 0,
  target: 0,
  chrono: { minute: 1, second: 20 },
  gameOver: false,
  competency: [],
  idBullet: 0
};

const allItemCatched = (competency: Competency[]) => {
  for (let competence of competency) {
    if (!competence.catched) {
      return false;
    }
  }
  return true;
};

const generateNewFriend = (windowSize:number): Friend => {
  const peach = {
    id: "peach",
    width: 105,
    height: 160,
    isSick: false,
    x: windowSize / 2,
    y: 30
  };
  console.log('peach: ', peach);
  return peach;
};

export const generateNewMisc = (x: number, y: number, type = "mask") => {
  const id = generateUniqueID();

  const data = {
    mask: {
      width: maskConstant.width,
      height: maskConstant.height
    },
    mushroom: {
      width: 65,
      height: 65
    }
  };
  return {
    width: (data as any)[type]?.width,
    height: (data as any)[type]?.height,
    type,
    id,
    x,
    y: y + (data as any)[type]?.height
  };
};

const reducer = (state: State, action: ActionType) => {
  switch (action.type) {
    case "SET_WINDOW":
      delete action.type;
      state.windowInfo = { ...action };
      return { ...state };
    case "CURE":
      delete state.misc[action.payload.id];
      state.friend.isSick = false;
      return { ...state };
    case "START_GAME":
      initHeroes.email = action.payload.email;
      initHeroes.name = action.payload.name;
      state.gameType = action.payload.tutorial ? "tutorial" : "game";
      state.intro = false;
      return { ...state };
    case "HIT":
      const actualBox = state.bonus[action.payload.type];
      actualBox.hit = true;
      const getItem = () => {
        const random = Math.round(Math.random() * 2);
        const item = ["mask", "mushroom", "mushroom"];
        return item[random];
      };
      const newMisc = generateNewMisc(
        actualBox.left,
        actualBox.bottom,
        !state.friend?.isSick ? "mask" : getItem()
      );
      state.misc[newMisc.id] = newMisc;
      state.bonus[action.payload.type].hit = true;
      return { ...state };
    case "MOVE_MASK":
      state.misc[action.payload.id].x = action.payload.x;
      state.misc[action.payload.id].y = action.payload.y;
      return { ...state };
    case "REINIT_CASE":
      state.bonus[action.payload.type].hit = false;
      return { ...state };
    case ADD_PLAYER:
      return {
        ...state,
        player: { ...initHeroes }
      };
    case SET_SOUND:
      return { ...state, sound: !state.sound };
    case "ADD_FRIEND":
      state.friend = generateNewFriend(state.windowInfo.windowSize);
      return { ...state };
    case "FRIEND_IS_SICK":
      if (state.friend) state.friend.isSick = true;
      return { ...state };
    case "IS_DOCTOR":
      state.misc &&
        Object.entries(state.misc).forEach(([key, value]: any) => {
          if (value.type === "mask") {
            delete state.misc[key];
          }
        });
      return { ...state };
    case "MOVE_FRIEND":
      if (state.friend) state.friend.x = action.payload.x;
      return { ...state };
    case "SET_PAUSE":
      if (state.player) {

        if (action.payload) {
          return { ...state, pause: false };
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
    case "EXACT_CASE_POSITION":
      console.log(action);
      state.bonus = { ...state.bonus, [action.payload.type]: action.payload };
      return { ...state };
      return state;
    case ADD_COMPETENCY:
      const newCompetency = [...state.competency, action.payload.newCompetency];
      return { ...state, competency: newCompetency };
    case ADD_TIME:
      if(state.chrono.minute ===0 && state.chrono.second === 0 ){
        if(!state.friend.isSick){
           // todo end
        state.win = true;
        }else {
          state.gameOver = true;
        }

      }
      if (state.chrono.second === 0 && state.chrono.minute >=1  ) {
        state.chrono.second = 60;
        state.chrono.minute -= 1;
      }
      if (state.chrono.second <= 60) {
        state.chrono.second -= 1;
      }
      return { ...state };
    case RESET_GAME:
      const init = {
        intro: false,
        gameType: "game" as GameType,
        windowInfo: state.windowInfo,
        player: { ...initHeroes },
        friend:generateNewFriend(state.windowInfo.windowSize)
      };
      state = { ...initialState, ...init };
      return { ...state };
    default: {
      return state;
    }
  }
};

export default reducer;
