import React, {useCallback, useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {useGameData} from "../store/GameProvider";
import avatar from '../img/test.png'
import {useAnimation, useKeyPress, useMoving} from "../helpers/helpers";
import Character from './Characters';

export const initHeroes = {
    name: 'player 1',
    position: {
        isJumping: false, // Frame Saut
        isIdle: true, // Frame idle
        isHaiduken: false, //Frame attack
        isRunning: false, //Frame attack
        isHurting: false, // frame Hurt
        isDynamiting: false, // Dynamite Attack
        isRunningLeft: false,
        isCrouching: false, // Frame se baisser
    },
    isConflict: false, // test la collision
    score: 0,
    isDying: false, // Hero Die
    supply: 3,
    spriteHeight: 80,
    health: 100,
    timelast: 0,
    width: 110,
    height: 100,
    x: 200,
    y: 454,
}

const spriteX = [-10, -126, -242, -358, -474, -590, -706, -822, -938, -1054]; // coordonnées X des sprites pour 10 frames
// 0 -> walk -100 -> Jump -200 -> Crouch -300 -> Walk Shoot  -400 -> Run -500 -> Die  -600 -> runShoot -700 -> crouchShoot -800 -> crouchDynamite -900->jumpShoot -1000 ->  Dynamite
const spriteY = [0, -100, -200, -300, -400, -500, -600, -700, -800, -900, -1000]; //bullet

const spriteValue = {
    isIdle:0,
    isRunning:-400,
    isRunningLeft:-400,
    isJumping:-100,
    isCrouching:-200,
    isWalkingShoot:-300,
    isDying:-500,
    isRunningShooting:-600,
    isChrouchShooting:-700,
    isCrouchDynamiting:-800,
    isJumpingShooting: -900,
    isDynmating: -1000
}

const Hero = () => {
    useKeyPress()
    useMoving(70)
    const [{player: {width, height, x, y,position}}] = useGameData();
    const [behavior, setBehavior] = useState(0)
    useLayoutEffect(()=>{
        for(let [key,value] of Object.entries(position)){
            if(value){
                console.log(key)
                const va = (spriteValue as any)[key]
                setBehavior(va)
                return;
            }
        }

    },[position])
    return (
       <Character width={width}
                  height={height}
                  x={x}
                  y={y}
                  avatar={avatar}
                  className="containerHero"
                  spriteX={spriteX}
                  behavior={behavior}/>)
}


export default Hero