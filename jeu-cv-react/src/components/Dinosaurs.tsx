import React, {useEffect, useRef, useState} from 'react';
import {windowSize} from "../constants/contants.tsx";
import raptorBleu from '../img/Dino/raptor-bleu.png';
import raptorVert from '../img/Dino/raptor-vert.png';
import pachy from '../img/Dino/pachy.png';
import ptero from '../img/Dino/ptero.png';
import diplo from '../img/Dino/diplo.png';
import spike from '../img/Dino/spike.png';
import {useInterval} from "../helpers/helpers";
import raptorNoise from '../sound/141.mp3';
import pteroNoise from '../sound/16456.mp3';
import diploNoise from '../sound/16467.mp3';
import {useGameData} from "../store/GameProvider";
import {MOVE_DINO} from "../constants";

const takeSoundChoice = (idSound: string, sound: boolean) => {
    const soundChoice = {
        raptor: raptorNoise,
        ptero: pteroNoise,
        diplo: diploNoise
    }
    for (let [s, val] of Object.entries(soundChoice)) {
        if (idSound === s) {
            const soundAudio = new Audio(val)
            if (sound) {
                soundAudio.currentTime = 0
                soundAudio.volume = 0.3
                soundAudio.play()
            } else {
                soundAudio.pause()
            }
            return;
        }
        return;
    }
}

export const peaksInit = {
    y: 484,
    avatar: spike,
    className: "spike",
    width: 70,
    height: 70,

}

export const raptorInit = () => {
    const raptorArray = [raptorBleu, raptorVert, pachy]
    const randomIndex = Math.round(Math.random() * 2)
    const raptorChoice = raptorArray[randomIndex]
    return ({
        y: 410,
        className: 'raptor',
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
    className: 'ptero',
    spriteX: [0, -128, -256, -384, -512],
    spriteY: [0, -100],
    width: 128,
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
    spriteXDead?: number[],
    health: number,
    spriteX?: number[],
    spriteY?: number[],
    widthDead?: number,
    idSound?: string,
    alive: boolean,
}

const Dinosaurs = ({id, x=windowSize, y, width, widthDead = 0, height, avatar, spriteX = [], spriteY = [], spriteXDead = [], className, idSound = '', speed, alive}: IPropsDino) => {
    const [{sound}, dispatch] = useGameData();
    const [frame, setFrame] = useState(0);
    const requestRef = useRef(spriteX[0]);
    const [typeSprite, setTypeSprite] = useState(0);
    const refPosition = useRef(x);
    const delayDinosaur: any = useRef(30);
    const [d, setD]= useState(false)
    useInterval(() => {
        if (refPosition.current < -width) {
            dispatch({type: 'DELETE_DINO', payload: {id}})
            delayDinosaur.current = null;
            return;
        } else {
            refPosition.current -= 8 + speed;
            dispatch({type: MOVE_DINO, payload: {x: refPosition.current, id}})
        }
    }, delayDinosaur.current)

    const style = {
        zIndex: 40,
        left: refPosition.current + "px",
        top: y + "px",
        width: alive ? width : widthDead + "px",
        height: height + "px",
        overflow: 'hidden'
    }
    useEffect(() => {
        takeSoundChoice(idSound, sound)
    }, [sound])

    const idS = useInterval(() => {
        setFrame(frame + 1);
        if (!alive) {
                setTypeSprite(spriteY[1])
                requestRef.current = spriteXDead[frame]
                if (frame === spriteXDead.length) {
                    dispatch({type: 'DELETE_DINO', payload: {id}})
                    clearInterval(idS)
                    return;
                }
        } else {
            if (frame >= spriteX.length) {
                setFrame(0)
            }
            requestRef.current = spriteX[frame]
        }

    }, 170)
    return (
        <div className={`dinosaurs ${className}`} style={style}>
            <img src={avatar} style={{left: requestRef.current + 'px', top: typeSprite + 'px', position: 'absolute'}} />
        </div>
    )
}

export const createDinosaur = () => {
    const tableDinosaur = [pteroInit, raptorInit(), diploInit, peaksInit]
    const random = Math.round(Math.random() * 3)
     return tableDinosaur[random]
}

export default Dinosaurs;