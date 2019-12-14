import React, {useEffect, useState, useRef, useLayoutEffect, useMemo} from 'react';
import MainHeader from '../components/MainHeader';
import {useGameData} from "../store/GameProvider";
import {ADD_PLAYER, ADD_DINO} from "../constants";
import Hero from "../components/Hero";
import {IPropsDino, createDinosaur, addDinosaurs} from "../components/Dinosaurs";

const Game = () => {
    const [{player, dino}, dispatch] = useGameData()
    const DinoMemoizedLength = ()=>useMemo(()=>dino.map((dinosaur:IPropsDino) => addDinosaurs(dinosaur)),[dino.length])
    const newRef= useRef(createDinosaur())
const [newDino, setNewDino] = useState(createDinosaur())
    useEffect(()=>{
        dispatch({type: ADD_PLAYER})
    }, [])
    useLayoutEffect(() => {
        newRef.current = createDinosaur()
        setNewDino(newRef.current)
        let f =setInterval(() => {
            dispatch({type: ADD_DINO, newDino})
        }, 5000)
        return ()=>clearInterval(f)
        console.log(dino)
    }, [dino.length])
    return (
        <>
            {player && <MainHeader score={player.score} health={player.health} dynamite={player.dynamite}/>}

            {player && <Hero />}
            {DinoMemoizedLength()}
        </>
    )
}

export default Game;