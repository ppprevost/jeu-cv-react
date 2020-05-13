import { ADD_DINO, DELETE_DINO, KILL_DINO, MOVE_DINO } from "../constants";
import {
  competencyArray,
  heightCompetency,
  widthCompetency
} from "../constants/contants";
import { competencyFixed, generateUniqueID } from "../helpers/main_helpers";
import {
  ActionType,
  AliveElement,
  ExistingHero,
  State
} from "./global_reducer";
import { IPropsDino } from "../components/Virus";
import watchOutSound from "../sound/OOT_Navi_WatchOut1.mp3";

const findDino = (action: ActionType) => {
  console.log(action)
  return ({ id }: IPropsDino) => action.payload.id === id;
};

const watchSound = new Audio(watchOutSound);

const reducer = (state: ExistingHero, action: ActionType) => {
  switch (action.type) {
    case ADD_DINO:
      const newDino = { ...action.newDino };
      state.idDino += 1;
      newDino.alive = true;
      newDino.speed = Math.round(Math.random() * 5);
      newDino.y = Math.round(Math.random() * 100);
      newDino.id = state.idDino;
      if(state.dino.length < 6){
        return { ...state, dino: [...state.dino, newDino] };
      }
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
    case "ADD_PANGOLIN":
      const newPang = { ...action.payload };
      newPang.y = 30;
      if (!state.pangolin[newPang.direction])
        state.pangolin[newPang.direction] = { ...newPang };
      return { ...state };
    case "ANIMATE_PANGOLIN":
      if (state.pangolin[action.payload.direction]) {
        state.pangolin[action.payload.direction].x = action.payload.x;
      }
      return { ...state };
    case "CHASE_PANGOLIN":
      state.pangolin[action.payload.direction].hurt = true;
      return { ...state };
    case "DELETE_PANGOLIN":
      delete state.pangolin[action.payload.direction];
    default:
      return state;
  }
};

export default reducer;
