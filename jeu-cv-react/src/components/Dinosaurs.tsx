import React, {useEffect, useRef, useState} from 'react';
import {windowSize} from "../constants/contants.tsx";
import raptorBleu from '../img/Dino/raptor-bleu.png';
import raptorVert from '../img/Dino/raptor-vert.png';
import pachy from '../img/Dino/pachy.png';
import ptero from '../img/Dino/ptero.png';
import diplo from '../img/Dino/diplo.png';
import {useAnimation, useInterval} from "../helpers/helpers";
import raptorNoise from '../sound/141.mp3';
import pteroNoise from '../sound/16456.mp3';
import diploNoise from '../sound/16467.mp3';
import {useGameData} from "../store/GameProvider";
import {MOVE_DINO} from "../constants";

const takeSoundChoice = (idSound:string, sound:boolean)=> {
const soundChoice = {
    raptor:raptorNoise,
    ptero:pteroNoise,
    diplo:diploNoise
}
    for(let [s, val] of Object.entries(soundChoice)){
        if(idSound === s){
            const soundAudio =new Audio(val)
            if (sound) {
                soundAudio.volume = 0.3
                soundAudio.play()
            } else {
                soundAudio.pause()
            }
            return;
        }
    }
}

export const raptorInit = () => {
    const raptorArray = [raptorBleu, raptorVert, pachy]
    const randomIndex = Math.round(Math.random() * 2)
    const raptorChoice = raptorArray[randomIndex]
    return ({
        y: 410,
        className: 'raptor',
        x: windowSize,
        health: 200,
        avatar: raptorChoice,
        spriteX: [0, -249, -498, -747, -996, -1245, -1494, -1743],
        spriteXDead: [0, -249, -498, -747, -996, -1245, -1494, -1743, -1992, -2241],
        spriteY: [0, -150, -300, -450],
        width: 205,
        widthDead: 249,
        height: 150,
        idSound: 'raptor'
    })
}

const pteroInit = {
        y: 282,
        health: 60,
        avatar: ptero,
        className: 'containerPtero',
        spriteX: [0, -128, -256, -384, -512],
// 	//0 -> Attack  -100 -> Run
    spriteY: [0, -100],
    spriteXDead: [],
    width: 128, // retranchement de 28px
    height: 100,
    idSound: "ptero"
}


const diploInit = {
    y: 425,
    spriteXDead: [0, -228, -456, -684, -912, -1140, -1368, -1596, -1824, -2052],
    health: 100,
    avatar: diplo,
    className: 'containerDiplo',
    spriteX: [0, -228, -456, -684, -912, -1140, -1368, -1596],
    spriteY: [-15, -150, -300, -450],
    width: 185,
    widthDead: 228,
    height: 130,
    idSound: "diplo"
}

export interface IPropsDino {
    id: number,
    speed: number,
    x: number,
    y: number,
    avatar: string,
    className: string,
    width: string | number,
    height: string | number,
    spriteXDead: number[],
    health: number,
    spriteX: number[],
    spriteY: number[],
    widthDead: number,
    idSound: string,
    alive: true,
}

const Dinosaurs = ({id, x, y, width, height, avatar, spriteX, className, idSound, speed}: IPropsDino) => {
    const [{sound}, dispatch] = useGameData()
    //const positionX = useMovingDinosaur(40, id, x, speed)
    const refPosition = useRef(x);
    const [positionX, setPositionX] = useState(x);
    let cc =useInterval(()=>{
        if (refPosition.current < -width) {
            dispatch({type: 'DELETE_DINO', payload: {id}})
            clearInterval(cc)
            return;
        } else {
        refPosition.current -= 8 + speed ;
        setPositionX(refPosition.current)
        dispatch({type: MOVE_DINO, payload: {x: positionX, id}})
        }
    }, 30)

    const style = {
        zIndex: 40,
        left: positionX + "px",
        top: y + "px",
        width: width + "px",
        height: height + "px",
        overflow: 'hidden'
    }
    useEffect(() => {
       takeSoundChoice(idSound, sound)
    }, [sound])

    const {sprite} = useAnimation(170, spriteX)
    return (
        <div className={`dinosaurs ${className}`} style={style}>
            <img src={avatar} style={{left: sprite + 'px', top: 0 + 'px', position: 'absolute'}} />
        </div>
    )
}

Dinosaurs.defaultProps = {
    id: 1,
    speed: Math.round(Math.random() * 10) + 1, //random value for random speed
    x: windowSize,
    health: null,
    y: null,
    src: null,
    className: null,
    spriteX: null,
    spriteXDead: null,
    spriteY: null,
    width: null,
    widthDead: null,
    height: null,
    alive: true,
    idSound: null
}

export const createDinosaur = () => {
    const tableDinosaur = [pteroInit, raptorInit(), diploInit]
    const random = Math.round(Math.random() * 2)
    return tableDinosaur[random]
}

export default Dinosaurs;