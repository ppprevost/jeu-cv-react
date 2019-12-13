import React, {createContext, useContext, useReducer} from "react";
import {ADD_PLAYER, SET_SOUND, MOVE_RIGHT, MOVE_LEFT, ADD_DINO} from "../constants";
import {initHeroes} from "../components/Hero";
import {IPropsDino} from "../components/Dinosaurs";

type ActionType = {
    type:string
    [key:string]:any
}

type State = {
    sound:boolean,
    player: typeof initHeroes
    dino: IPropsDino[]
}


const UserContext = createContext<any>(null);
const initialState = {
    sound: true,
    player: null,
    dino: []
};

const repercutPositionHero = (state:State, newPosition: string) => {
    const initObject = {};
    Object.keys(state.player.position)
        .map((key) => (initObject as any)[key] = false)
    return {
        ...state,
        player:
            {...state.player, position: {...initObject, [newPosition]: true,}}
    }
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
            let newState;
                return newState = repercutPositionHero(state, 'isRunning');
        case MOVE_LEFT:
                return repercutPositionHero(state, 'isRunningLeft');
        case 'IDLE':
            return repercutPositionHero(state, 'isIdle');
        case 'IS_CROUCHING':
            return repercutPositionHero(state, 'isCrouching');
        case 'ANIMATE_PLAYER':
            return {...state, player:{...state.player, x:action.x}}
        case ADD_DINO:
            const newDino = {...action.newDino}
            newDino.id = state.dino.length +1
         return {...state, dino: [...state.dino, newDino]}
        case 'MOVE_DINO':
            console.log('fdsfsd new dino move')
            let actualDino = state.dino.findIndex(({id}:IPropsDino) => action.dino.id === id)
            state[actualDino] = action.actualDino
            if(actualDino){
            return {...state}
            }
    }
}


const GameProvider: React.FunctionComponent = ({children}) => {
    const contextValue = useReducer(reducer, initialState)
    console.log('contextValue: ', contextValue);
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