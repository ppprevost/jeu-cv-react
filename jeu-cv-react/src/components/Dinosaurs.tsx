import React, {useEffect, useRef, useState} from 'react';
import {dinoSpeed, windowSize} from "../constants/contants";
import raptorBleu from '../img/Dino/raptor-bleu.png';
import raptorVert from '../img/Dino/raptor-vert.png';
import pachy from '../img/Dino/pachy.png';
import ptero from '../img/Dino/ptero.png';
import pteroLeft from '../img/Dino/ptero_left.png';
import vine from '../img/Dino/vine.png';
import diplo from '../img/Dino/diplo.png';
import diploLeft from '../img/Dino/diplo_left.png';
import spike from '../img/Dino/spike.png';
import {useInterval} from "../helpers/hooks";
import raptorNoise from '../sound/raptor.mp3';
import pteroNoise from '../sound/pterodactyl.mp3';
import diploNoise from '../sound/diplo.mp3';
import {useGameData} from "../store/GameProvider";
import {MOVE_DINO} from "../constants";
import {initHeroes} from "./Hero";
import Explosion from "./Explosion";
import DinosaurSprite from "./SpriteElement"

interface EnemyInit {
    x?: number,
    y: number,
    avatar: string | string[]
    spriteX?: number[]
    spriteXDead?: number[]
    width: number
    height: number
    widthDead?: number
    idSound?: string
    className: string
    spriteY?: number[]
    health?: number
}

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

        }

    }
}


export const peaksInit = {
    y: 504,
    avatar: [spike],
    className: "spike",
    width: 70,
    height: 50,

}

export const vinesInit = {
    y: 0,
    avatar: [vine],
    className: "vine",
    width: 41,
    height: 477,
}

export const raptorInit = (): EnemyInit => {
    const raptorArray = [raptorBleu, raptorVert, pachy]
    const randomIndex = Math.round(Math.random() * 2)
    const raptorChoice = raptorArray[randomIndex]
    return ({
        y: 410,
        className: 'raptor',
        health: 200,
        avatar: [raptorChoice],
        spriteX: [0, -249, -498, -747, -996, -1245, -1494, -1743],
        spriteXDead: [0, -249, -498, -747, -996, -1245, -1494, -1743, -1992, -2241],
        spriteY: [0, -150, -300, -450],
        width: 205,
        widthDead: 249,
        height: 150,
        idSound: 'raptor'
    })
}

export const pteroInit: EnemyInit = {
    y: 282,
    avatar: [ptero, pteroLeft],
    className: 'ptero',
    spriteX: [0, -128, -256, -384, -512],
    spriteY: [0, -100],
    width: 128,
    height: 100,
    idSound: "ptero"
}

export const diploInit: EnemyInit = {
    y: 415,
    spriteXDead: [0, -228, -456, -684, -912, -1140, -1368, -1596, -1824, -2052],
    health: 100,
    avatar: [diplo, diploLeft],
    className: 'containerDiplo',
    spriteX: [0, -228, -456, -684, -912, -1140, -1368, -1596],
    spriteY: [-15, -150, -300, -450],
    width: 185,
    widthDead: 228,
    height: 140,
    idSound: "diplo"
}

export interface IPropsDino {
    id: number,
    speed: number,
    x: number,
    y: number,
    avatar: string,
    className: string,
    width: number,
    height: number,
    spriteXDead?: number[],
    health: number,
    spriteX?: number[],
    spriteY?: number[],
    widthDead?: number,
    idSound?: string,
    alive: boolean,
}


const conditionToConflict =(className:string, positionHero:number, refPosition:any, width:number, player:typeof initHeroes, y:number , height:number)=>{
    if(className ==='vine' && !player.position.isCrouching){
        return  positionHero >= refPosition.current
        && positionHero <= refPosition.current + width
    }
    return positionHero >= refPosition.current
        && positionHero <= refPosition.current + width
        && player.y + player.height >= y
        && player.y + player.height <= y + height
}

const Dinosaurs = ({id, x = windowSize, y, width, widthDead = 0, height, avatar, spriteX = [], spriteY = [], spriteXDead = [], className, idSound = '', speed, alive}: IPropsDino) => {
    const [{sound, player}, dispatch] = useGameData();
    const [frame, setFrame] = useState(0);
    const requestRef = useRef(spriteX[0]);
    const [typeSprite, setTypeSprite] = useState(0);
    const refPosition = useRef(x);
    const positionInitial = useRef(0);
    const delayDinosaur = useRef<number | null>(30);
    useEffect(() => {
        positionInitial.current = x
    }, [])

    useInterval(() => {
        const positionHero = positionInitial.current === -width ? player.x : player.x + player.width
        if (alive && conditionToConflict(className, positionHero, refPosition, width, player, y, height)) {
            dispatch({type: 'COLLISION'})
        }
        if (positionInitial.current === -width) {
            if (refPosition.current > windowSize + width) {
                dispatch({type: 'DELETE_DINO', payload: {id}})
                delayDinosaur.current = null;
                return;
            } else {
                refPosition.current += dinoSpeed + speed;
                dispatch({type: MOVE_DINO, payload: {x: refPosition.current, id}})
            }
        } else {
            if (refPosition.current < -width) {
                dispatch({type: 'DELETE_DINO', payload: {id}})
                delayDinosaur.current = null;
                return;
            } else {
                refPosition.current -= dinoSpeed + speed;
                dispatch({type: MOVE_DINO, payload: {x: refPosition.current, id}})
            }
        }
    }, delayDinosaur.current)
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
    useEffect(()=>{
        setFrame(0)
    }, [alive])
    return (
       <>
           <DinosaurSprite
               zIndex={40}
               className={`dinosaurs ${className}`}
               src={avatar}
               x={x}
               behavior={typeSprite}
               width={alive ? width : widthDead}
               height={height}
               y={y}
               sprite={requestRef.current}

           />

          { !alive && player.position.isDynamiting && <Explosion x={refPosition.current} y={y}/>}
           </>
    )
}

export const createDinosaur = (): EnemyInit => {
    const tableDinosaur = [pteroInit, raptorInit(), diploInit, peaksInit, vinesInit]
    const random = Math.round(Math.random() * (tableDinosaur.length-1))
    const chosenDinosaur = {...tableDinosaur[random]} as EnemyInit
    const randomPosition = [windowSize, -chosenDinosaur.width][Math.round(Math.random())];
    chosenDinosaur.x = chosenDinosaur.avatar.length > 1 || chosenDinosaur.className === 'spike' || chosenDinosaur.className === 'vine' ? randomPosition : windowSize;
    chosenDinosaur.avatar = randomPosition === windowSize || chosenDinosaur.avatar.length < 2 ? chosenDinosaur.avatar[0] : chosenDinosaur.avatar[1]
    return chosenDinosaur
}

export default Dinosaurs;