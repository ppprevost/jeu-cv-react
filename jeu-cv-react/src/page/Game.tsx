import React, {useEffect, useState, useRef} from 'react';
import MainHeader from '../components/MainHeader';
import {useGameData} from "../store/GameProvider";
import {ADD_PLAYER, ADD_DINO} from "../constants";
import Hero from "../components/Hero";
import Dinosaur, {IPropsDino, raptorInit} from "../components/Dinosaurs";

const addDinosaurs = (dinosaur: any) => {
    switch (dinosaur.idSound) {
        case 'raptor':
            return <Dinosaur {...dinosaur} key={dinosaur.id} />
    }
}

const Game = () => {
    const [{player, dino}, dispatch] = useGameData()
    useEffect(() => {
        dispatch({type: ADD_PLAYER})
        setInterval(() => {
            dispatch({type: ADD_DINO, newDino: raptorInit})
        }, 5000)
    }, [])
    return (
        <>
            <MainHeader
            />
            {player && <Hero />}
            {dino.map((dinosaur:IPropsDino) => addDinosaurs(dinosaur))}

        </>
    )

}

export default Game;