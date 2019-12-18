import React, {useEffect, useState, useRef, useMemo, CSSProperties} from 'react';
import {useGameData} from "../store/GameProvider";
import {ADD_PLAYER, ADD_DINO} from "../constants";
import Hero from "../components/Hero";
import Dinosaurs, {IPropsDino, createDinosaur} from "../components/Dinosaurs";
import Background from "../components/Background";
import {useConflict, useInterval} from "../helpers/helpers";
import field from '../img/field.png';
import mainSound from '../sound/main.mp3'
import BulletComponent, {IBulletProps} from "../components/Bullet";

const MemoizedHero = () => {
    const [player] = useGameData()
    return useMemo(() => <Hero />, [player])
}


const useCorrectSendingDiosaur = ()=>{

}

// TODO correct problem of closing onglet on chrome
let interval: number; //30fps
let before = new Date();
let now: Date;
if (window.matchMedia("(min-width: 1400px)").matches) {
    interval = 1700;
} else {
    interval = 2000;
}
let leftValue = 0;

function animationFrame() {
    now = new Date();
    var elapsedTime = (now.getTime() - before.getTime());
    if (elapsedTime > interval) {
        // Recover the motion lost while inactive
        leftValue += Math.floor(elapsedTime / interval);
    } else {
        leftValue++;
    }
    before = now;
    //requestAnimationFrame();
}

const Field = () => {
    const style: CSSProperties = {
        zIndex: 5,
        position: 'absolute',
        top: 548,
    }
    return (<img src={field} style={style} alt="" />)
}

const ambianceSound = new Audio(mainSound)

const launchNewDinosaur = ()=> {


}


const Game = () => {
    const xBackground = window.innerWidth / 4;
    const [{player, dino, gameOver, sound, bullets}, dispatch] = useGameData();
    useConflict();
    const FixedBackground = (compute: number) => useMemo(() => <Background left={compute} />, [xBackground])
    const DinoMemoizedLength = () => useMemo(() => dino.map((dinosaur: IPropsDino) => <Dinosaurs {...dinosaur}
                                                                                                 key={dinosaur.id} />), [])
    const newRef = useRef(createDinosaur());
    const [newDino, setNewDino] = useState(createDinosaur())
    const id = useInterval(() => {
        newRef.current = createDinosaur()
        setNewDino(newRef.current)
        dispatch({type: ADD_DINO, newDino});
        if (gameOver) {
            clearInterval(id)
        }
    }, 2000)
    useEffect(() => {
        dispatch({type: ADD_PLAYER})
    }, [])
    useEffect(() => {
        console.log('sound: ', sound, gameOver);
        if (sound && !gameOver) {
            ambianceSound.play()
            ambianceSound.loop = true;
            ambianceSound.volume = 0.07;
        } else {
            ambianceSound.pause()
        }
    }, [sound, gameOver])
    return (
        <>
            {FixedBackground(xBackground)}
            {FixedBackground(xBackground * 2)}
            {FixedBackground(xBackground * 3)}
            {player && MemoizedHero()}
            {dino.map((dinosaur: IPropsDino) => <Dinosaurs {...dinosaur}
                                                           key={dinosaur.id} />)}
            <Field />
        </>
    )
}

export default Game;