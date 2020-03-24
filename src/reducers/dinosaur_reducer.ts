import {ADD_DINO, DELETE_DINO, KILL_DINO, MOVE_DINO, RAMPAGE} from "../constants";
import {competencyArray, heightCompetency, widthCompetency} from "../constants/contants";
import {competencyFixed, playSoundRampage} from "../helpers/main_helpers";
import {ActionType, ExistingHero, State} from "./global_reducer";
import {IPropsDino} from "../components/Dinosaurs";
import watchOutSound from "../sound/OOT_Navi_WatchOut1.mp3";

const findDino = (action: ActionType) => {
    return ({ id }: IPropsDino) => action.payload.id === id;
};

const watchSound = new Audio(watchOutSound);

const reducer = (state:ExistingHero,action:ActionType)=> {
    switch(action.type){
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
        case RAMPAGE:
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
        default: return state
    }

}

export default reducer

