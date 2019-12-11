import React, {createContext, useContext, useReducer, useState} from "react";
import {ADD_PLAYER} from "../constants";
import Hero from "../components/Hero";
import {initHeroes} from "../components/Hero";

const UserContext = createContext<any>([]);
const initialState = {
    sound:true,
    player:null,
    dino:[]
};

export const reducer = (state: any, action: any) => {
    switch (action.type) {

        case 'SET_SOUND': return {...state, sound:!state.sound}

        case ADD_PLAYER:
            return {
                ...state,
                player: {...initHeroes}
            }
        case 'MOVE_RIGHT':
            return {
                ...state,
                player: {
                    ...state.player,
                    x: state.player.x + action.x
                }
            };
        case "ADD_DINO": //

    }
}



const GameProvider:React.FunctionComponent = ({children}) => {
    const contextValue =useReducer(reducer, initialState)
    return (
        // @ts-ignore
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}

export const useGameData =()=> useContext(UserContext)

export {UserContext, GameProvider};

export default GameProvider;