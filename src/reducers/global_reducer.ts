import {IHero, initHeroes} from "../data/player";
import {
    ADD_COMPETENCY, ADD_PLAYER,
    ADD_TIME, GET_COMPETENCY,
    RESET_GAME,
    SET_SOUND,
} from "../constants";
import { repercutPositionHero} from "../helpers/main_helpers";
import {IBulletProps} from "../components/Bullet";
import {competencyArray} from "../constants/contants";
import winner from "../sound/winner.mp3";
import {Competency} from "../components/Competency";
import {IPropsDino} from "../components/Dinosaurs";

export type ActionType = {
    type: string;
    [key: string]: any;
};

export interface ExistingHero extends State {
    player:IHero
}

type GameType = "game" | "tutorial";

export type State = {
    intro: boolean;
    gameType: GameType | null;
    sound: boolean;
    player: IHero | null;
    dino: IPropsDino[];
    idDino: number;
    direction: string;
    win: boolean;
    idBullet: number;
    target: number;
    gameOver: boolean;
    windowInfo: any;
    pause: boolean;
    competency: Competency[];
    bullets: IBulletProps[];
    chrono: { minute: number; second: number };
};

const winnerSound = new Audio(winner);

export const initialState: State = {
    windowInfo: {},
    intro: true,
    gameType: null,
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

const allItemCatched = (competency: Competency[]) => {
    for (let competence of competency) {
        if (!competence.catched) {
            return false;
        }
    }
    return true;
};

const reducer = (state: State, action: ActionType) => {
    switch (action.type) {
        case "SET_WINDOW":
            delete action.type;
            state.windowInfo = { ...action };
            return { ...state };
        case "START_GAME":
            initHeroes.email = action.payload.email;
            initHeroes.name = action.payload.name;
            state.gameType = action.payload.tutorial ? 'tutorial' : 'game';
            state.intro = false;
            return { ...state };
        case ADD_PLAYER:
            return {
                ...state,
                player: { ...initHeroes }
            };
        case SET_SOUND:
            return { ...state, sound: !state.sound };
        case "SET_PAUSE":
            if (state.player) {
                // if pause you have to prevent shooting behavior
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
        case "STOP_BULLET":
            state.bullets = state.bullets.filter(
                ({ id }: IBulletProps) => action.payload.id !== id
            );
            if (action.payload.type === "dynamite") {
                return repercutPositionHero(state, "isDynamiting", true);
            }
            return { ...state };
        case ADD_COMPETENCY:
            const newCompetency = [...state.competency, action.payload.newCompetency];
            return { ...state, competency: newCompetency };
        case GET_COMPETENCY:
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
        case ADD_TIME:
            if (state.chrono.second < 60) {
                state.chrono.second += 1;
            }
            if (state.chrono.second === 60) {
                state.chrono.second = 0;
                state.chrono.minute += 1;
            }
            return { ...state };
        case RESET_GAME:
            const init = {
                intro: false,
                gameType: "game" as GameType,
                windowInfo: state.windowInfo,
                player: { ...initHeroes }
            };
            state = { ...initialState, ...init };
            return { ...state };
        default: {
            return state
        }
    }
};

export default reducer;