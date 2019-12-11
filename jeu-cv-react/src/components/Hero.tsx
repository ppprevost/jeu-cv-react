import React, {useEffect, useState, useRef} from 'react';
import {useGameData} from "../store/GameProvider";
import avatar from '../img/test.png'
import {useAnimation, useKeyPress} from "../helpers/helpers";

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

const Hero = () => {
    const [{player: {width, height, x, y}}, dispatch] = useGameData();
    const {sprite, mood} = useAnimation(70, spriteX)

    const move = spriteY[0];
    const right = useKeyPress('r')
    const style = {
        width, height, left: x, top: y
    }
    return (
        <div className="containerHero" style={style}>
            <img src={avatar} style={{left: sprite + 'px', top: mood + 'px'}} /></div>)
}


export default Hero