import React, {createContext, useContext, useReducer} from "react";
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
    COLLISION
} from "../constants";
import {initHeroes} from "../components/Hero";
import {IPropsDino} from "../components/Dinosaurs";
import {windowSize} from "../constants/contants.tsx";

type ActionType = {
    type: string
    [key: string]: any
}

type State = {
    sound: boolean,
    player: typeof initHeroes
    dino: IPropsDino[]
    idDino: number
    gameOver: boolean
    competency: number
    bullets: IBulletProps[]
    chrono: { minute: number, second: number }
}


const UserContext = createContext<any>([]);
const initialState = {
    sound: false,
    player: null,
    dino: [],
    bullets: [],
    idDino: 0,
    chrono: {minute: 0, second: 0},
    gameOver: false,
    competency: 0,
    idBullet: 0
};

const repercutPositionHero = (state: State, newPosition: string) => {
    const initObject = {};
    Object.keys(state.player.position)
        .map((key) => (initObject as any)[key] = false)
    return {
        ...state,
        player:
            {...state.player, position: {...initObject, [newPosition]: true,}}
    }
}

const findDino = (action: ActionType) => {
    return ({id}: IPropsDino) => action.payload.id === id
}


export const reducer = (state: any, action: ActionType) => {
    switch (action.type) {
        case SET_SOUND:
            return {...state, sound: !state.sound};
        case ADD_PLAYER:
            return {
                ...state,
                player: {...initHeroes}
            }
        case MOVE_RIGHT:
            return repercutPositionHero(state, 'isRunning');
        case MOVE_LEFT:
            return repercutPositionHero(state, 'isRunningLeft');
        case IDLE:
            return repercutPositionHero(state, 'isIdle');
        case IS_CROUCHING:
            return repercutPositionHero(state, 'isCrouching');
        case 'DYNAMITE':
            state.idBullet ++;
            state.bullet = [...state.bullet, ({type: 'dynamite',id:state.idBullet})];
            return {...state}
            break;
        case 'SHOOT':
            state.idBullet ++;
            const newBullet = {type: 'bullet', id: state.idBullet};
            state.bullets = [...state.bullets, newBullet]
            state = repercutPositionHero(state, 'isWalkingShoot')
            return {...state}
        case 'STOP_SHOOTING':
            return repercutPositionHero(state, 'isIdle');
            case 'STOP_JUMPING':
                state.player.stopJump = false;
            return repercutPositionHero(state, 'isIdle');
        case 'STOP_BULLET':
            state.bullets = state.bullets
                .filter(({id}: IBulletProps) => action.id !== id)
            return {...state}
        case 'ANIMATE_PLAYER':
            console.log(action.y)
            return {...state, player: {...state.player, x: action.x, y:action.y? action.y : {}}}
        case 'LAND_PLAYER':
            console.log('landing')
            state.player.stopJump = true;
            return {...state}
        case 'STOP_HURTING':
            console.log('stop hurt')
            if (state.player.health > 0) {
                return repercutPositionHero(state, 'isIdle')
            }
            return {...state}
        case 'JUMP':
            return repercutPositionHero(state, 'isJumping');
        case ADD_DINO:
            const newDino = {...action.newDino}
            state.idDino += 1;
            newDino.alive = true;
            if(newDino.className==='spike'){
               // newDino.x = [windowSize, 0][Math.round(Math.random())]
            }
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
        case 'KILL_DINO':
            let actualDinoToKill = state.dino.findIndex(findDino(action));
            console.log(actualDinoToKill)
            state.dino[actualDinoToKill].alive = false;
            state.player.score += 1
            return {...state}
        case COLLISION:
            if (!state.player.position.isHurting) {
                const hurtedPlayerState = repercutPositionHero(state, 'isHurting');
                if (hurtedPlayerState.player.health > 0) {
                    hurtedPlayerState.player.health -= 10
                }
                if (hurtedPlayerState.player.health <= 0) {
                    hurtedPlayerState.gameOver = true;
                }
                return {...hurtedPlayerState}
            }
            return {...state}
        case 'ADD_COMPETENCY':
            const newCompentecy = state.competency + 1;
            return {...state, competency: newCompentecy}
            break;
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
            const initialState = {...state}
            initialState.player = initHeroes
            return initialState
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

const GameProvider: React.FunctionComponent = ({children}) => {
    const contextValue = useReducer(reducer, initialState)
    return (
        // @ts-ignore
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}

export const useGameData = () => useContext(UserContext)

export {UserContext, GameProvider};

export default GameProvider;