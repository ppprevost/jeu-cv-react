import React, {useEffect} from 'react';
import MainHeader from '../components/MainHeader';
import {useGameData} from "../store/GameProvider";
import {ADD_PLAYER} from "../constants";
import Hero from "../components/Hero";

const Game = () => {
    const [{player}, dispatch] = useGameData()

    useEffect(() => {
        dispatch({type: ADD_PLAYER})
    })

    return (
        <>
            <MainHeader
            />
            {player && <Hero />
            }
        </>
    )

}

export default Game;