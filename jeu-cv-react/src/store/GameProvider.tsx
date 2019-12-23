import React, {createContext, FunctionComponent, useContext, useEffect, useReducer, useState} from "react";
import {IBulletProps} from "../components/Bullet";
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
    COLLISION, STOP_HURTING, LAND_PLAYER, STOP_SHOOTING, JUMP, KILL_DINO
} from "../constants";
import {initHeroes, Hero} from "../components/Hero";
import {IPropsDino} from "../components/Dinosaurs";
import {competencyArray} from "../constants/contants";
import watchOutSound from "../sound/OOT_Navi_WatchOut1.mp3";
import shotSound from "../sound/fusil.mp3";
import explode from "../sound/explode.mp3";
import winner from "../sound/winner.mp3";
import doubleKill from "../sound/double_kill.mp3";
import ultrakill from "../sound/ultrakill.mp3";
import {Competency} from "../components/Competency";

type ActionType = {
    type: string
    [key: string]: any
}

type State = {
    sound: boolean,
    player: Hero | null
    dino: IPropsDino[] | []
    idDino: number
    direction: string
    win: boolean
    idBullet: number
    target: number
    gameOver: boolean
    pause: boolean,
    competency: any[]
    bullets: IBulletProps[] | []
    chrono: { minute: number, second: number }
}

const UserContext = createContext<any>([]);

const initialState = {
    direction: 'right',
    sound: false,
    player: null,
    dino: [],
    pause: false,
    bullets: [],
    win: false,
    idDino: 0,
    target: 0,
    chrono: {minute: 0, second: 0},
    gameOver: false,
    competency: [],
    idBullet: 0
};
const watchSound = new Audio(watchOutSound)
const rifleSound = new Audio(shotSound)
const winnerSound = new Audio(winner)
const explodeSound = new Audio(explode)
const doubleKillSound = new Audio(doubleKill)
const ultraKillSound = new Audio(ultrakill)

const allItemCatched = (competency: Competency[]) => {
    for (let competence of competency) {
        if (!competence.catched) {
            return false
        }
    }
    return true
}

export const playSoundRampage = (dinoLength: number, sound: boolean) => {
    if (sound) {
        ultraKillSound.currentTime = 0
        explodeSound.play()
        explodeSound.volume = 0.8;
        if (dinoLength >= 3) {
            ultraKillSound.currentTime = 0
            ultraKillSound.play()
            ultraKillSound.volume = 0.4;
        }
        if (dinoLength < 3 && dinoLength > 1) {
            doubleKillSound.play()
            doubleKillSound.volume = 0.4
            doubleKillSound.currentTime = 0
        }

    }

}

export const repercutPositionHero = (state: State, newPosition: string, stop?: boolean) => {
    let initObject: any = {};
    if (state.player && !state.pause) {
        if (newPosition === "isCrouching") {
            initObject = {...state.player.position}
            if (stop) {
                if (!state.player.position.isRunning || !state.player.position.isRunningLeft) {
                    initObject.isIdle = true;

                }
                initObject.isCrouching = false;
            } else {
                initObject.isRunning = false;
                initObject.isRunningLeft = false;
                initObject.isCrouching = true;
                initObject.isIdle = false;
                console.log('isCrouch', initObject, stop)
            }
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }
        }
        if (newPosition === "isShooting") {
            initObject = {...state.player.position}
            if (stop) {
                initObject.isShooting = false;
            } else {
                initObject.isShooting = true;
            }
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }
        }
        if (newPosition === "isRunning") {
            initObject = {...state.player.position}
            if (stop) {
                initObject.isRunning = false;
                initObject.isIdle = true;
            } else {
                initObject.isRunning = true;
                initObject.isIdle = false;
            }
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }
        }
        if (newPosition === "isRunningLeft") {
            initObject = {...state.player.position}
            if (stop) {
                initObject.isIdle = true;
                initObject.isRunningLeft = false;
            } else {
                initObject.isIdle = false;
                initObject.isRunningLeft = true;
            }
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }
        }
        if (newPosition === 'isDynamiting') {
            initObject = {...state.player.position}
            if (stop) {
                initObject.isDynamiting = false;
            } else {
                initObject.isDynamiting = true;
            }
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }

        }
        if (newPosition === "isIdle") {
            initObject = {...state.player.position}
            initObject.isRunning = false;
            initObject.isRunningLeft = false;
            initObject.isJumping = false;
            initObject.isCrouching = false;
            initObject.isHurting = false;
            initObject.isIdle = true;
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }
        }
        Object.keys(state.player.position)
            .map((key) => {
                return (initObject as any)[key] = false
            });
        return {
            ...state,
            player:
                {...state.player, position: {...initObject, [newPosition]: true,}}
        }

    }
    return state
}

const findDino = (action: ActionType) => {
    return ({id}: IPropsDino) => action.payload.id === id
}

export const reducer = (state: State = initialState, action: ActionType) => {
    switch (action.type) {
        case SET_SOUND:
            return {...state, sound: !state.sound};
        case 'SET_PAUSE':
            if(state.player){
                // if pause you have to prevent shooting behavior
            return {...state,player:{...state.player, position:{...state.player.position, isDynamiting:false, isShooting:false}}, sound: state.pause, pause: !state.pause}
            }
        case ADD_PLAYER:
            return {
                ...state,
                player: {...initHeroes}
            }
        case MOVE_RIGHT:
            state.direction = 'right';
            return repercutPositionHero(state, "isRunning", action.stop)
        case MOVE_LEFT:
            state.direction = 'left';
            return repercutPositionHero(state, "isRunningLeft", action.stop)
        case IDLE:
            return repercutPositionHero(state, "isIdle")
        case IS_CROUCHING:
            return repercutPositionHero(state, 'isCrouching', action.stop)
        case 'IS_DYNAMITING':
            state.idBullet++;
            if(state.player && state.player.dynamite > 0){
                state.player.dynamite -= 1
            state.bullets = [...state.bullets, ({type: 'dynamite', id: state.idBullet})];
            return repercutPositionHero(state, 'isDynamiting');

            }
            return {...state}
        case 'SHOOT':
            if (!state.win && !state.pause) {
                state.idBullet++;
                const newBullet = {type: 'bullet', id: state.idBullet};
                state.bullets = [...state.bullets, newBullet]
                if (state.sound) {
                    rifleSound.currentTime = 0;
                    rifleSound.volume = 0.2;
                    rifleSound.play();
                } else {
                    rifleSound.pause();
                }
                return repercutPositionHero(state, 'isShooting')
            }
        case STOP_SHOOTING:
            return repercutPositionHero(state, 'isShooting', true);
        case 'STOP_JUMPING':
            if (state.player) {
                state.player.stopJump = false;
            }
            return repercutPositionHero(state, 'isIdle');
        case 'STOP_BULLET':
            state.bullets = state.bullets
                .filter(({id}: IBulletProps) => action.id !== id)
            return {...state}
        case 'ANIMATE_PLAYER':
            console.log(action.y)
            return {...state, player: {...state.player, x: action.x, y: action.y ? action.y : {}}}
        case LAND_PLAYER:
            console.log('landing')
            if (state.player) {
                state.player.stopJump = true;
            }
            return {...state}
        case STOP_HURTING:
            console.log('stop hurt')
            if (state.player && state.player.health > 0) {
                return repercutPositionHero(state, 'isIdle')
            }
            return {...state}
        case JUMP:
            return repercutPositionHero(state, 'isJumping');
        case ADD_DINO:
            const newDino = {...action.newDino}
            state.idDino += 1;
            newDino.alive = true;
            newDino.speed = Math.round(Math.random() * 8)
            newDino.id = state.idDino;
            return {...state, dino: [...state.dino, newDino]}
        case MOVE_DINO:
            let actualDino = state.dino.findIndex(findDino(action))
            if (actualDino >= 0) {
                state.dino[actualDino].x = action.payload.x
            }
            return {...state}
        case DELETE_DINO:
            let actualDinoToDelete = state.dino.findIndex(findDino(action));
            state.dino.splice(actualDinoToDelete, 1);
            return {...state}

        case 'RAMPAGE':
            // @ts-ignore
            const existingDino = state.dino.filter(elem => elem.alive)
            console.log(existingDino)
            playSoundRampage(existingDino.length, state.sound)
            // @ts-ignore
            const newDinoArray = state.dino.map(dinosaur => {
                return ({...dinosaur, alive: false})
            })
            return repercutPositionHero({...state, dino: newDinoArray}, 'isDynamiting');
        case KILL_DINO:
            let actualDinoToKill = state.dino.find(findDino(action));
            let actualDinoToKillIndex = state.dino.findIndex(findDino(action));
            if (actualDinoToKill) {
                state.dino[actualDinoToKillIndex].alive = false;
                if (state.player) {
                    state.player.score += 10;
                    state.target += 1;
                    if (state.target > 0 && state.target % 2 === 0 && competencyArray[state.competency.length]) {
                        if (state.sound) {
                            watchSound.currentTime = 0
                            watchSound.volume = 0.7;
                            watchSound.play()
                        } else {
                            watchSound.pause()
                        }
                        const newCompetency = {
                            avatar: competencyArray[state.competency.length].img,
                            type: competencyArray[state.competency.length].type,
                            website: competencyArray[state.competency.length].website,
                            catched: false,
                            x: state.direction === 'right' ? actualDinoToKill.x : actualDinoToKill.x + actualDinoToKill.width,
                            y: actualDinoToKill.y + 50
                        }
                        return {...state, competency: [...state.competency, newCompetency]}
                    }
                }
            }
            return {...state}
        case COLLISION:
            if (state.player && !state.player.position.isHurting) {
                const hurtedPlayerState = repercutPositionHero(state, 'isHurting');
                if (hurtedPlayerState.player && hurtedPlayerState.player.health > 0) {
                    hurtedPlayerState.player.health -= 10;
                }
                if (hurtedPlayerState && hurtedPlayerState.player && hurtedPlayerState.player.health <= 0) {
                    hurtedPlayerState.gameOver = true;
                }
                return {...hurtedPlayerState}
            }
            return {...state}
        case 'ADD_COMPETENCY':
            console.log(action)

            const newCompetency = [...state.competency, action.payload.newCompetency]
            return {...state, competency: newCompetency}
            break;
        case 'GET_COMPETENCY':
            const catchedCompetency = state.competency.map(comp => {
                if (comp.type === action.payload.newComp) {
                    comp.catched = true;
                }

                if (state.player && competencyArray.length === state.competency.length && allItemCatched(state.competency)) {
                    if (state.sound) {
                        winnerSound.play()
                    }
                    state.gameOver = true;
                    state.win = true;
                }
                return comp
            })
            return {...state, competency: catchedCompetency}
        case 'ADD_TIME':
            if (state.chrono.second < 60) {
                state.chrono.second += 1
            }
            if (state.chrono.second === 60) {
                state.chrono.second = 0
                state.chrono.minute += 1
            }
            return {...state}
        case 'RESET_GAME':
            console.log('reset')
            state = {...initialState, player: initHeroes}
            return {...state}
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

const GameProvider: FunctionComponent = ({children}) => {
    const [state, setState] = useState({isLoaded: false});
    // @ts-ignore
    const contextValue = useReducer(reducer, initialState);
    useEffect(() => {
        setState({isLoaded: true});
    }, []);
    return (
        <UserContext.Provider value={contextValue}>
            {state.isLoaded && children}
        </UserContext.Provider>
    )
}

export const useGameData = () => useContext(UserContext)

export {UserContext, GameProvider};

export default GameProvider;