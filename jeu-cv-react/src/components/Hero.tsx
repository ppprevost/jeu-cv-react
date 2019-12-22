import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useGameData} from "../store/GameProvider";
import avatar from '../img/hunter.png';
import avatarLeft from "../img/hunter_left.png"
import {useInterval, useKeyPress} from "../helpers/helpers";
import Character from './Characters';
import heroHurtSound from '../sound/cri.mp3';
import Bullet, {IBulletProps} from './Bullet';
import {windowSize} from "../constants/contants";
import {Competency} from "./Competency";
import getItem from '../sound/OOT_Get_SmallItem1.mp3'

export interface Hero {
    name: string,
    position: any,
    stopJump: boolean
    isConflict: boolean
    score: number,
    dynamite: number,
    spriteHeight: number,
    health: number,
    width: number,
    height: number,
    x: number,
    y: number
}

const hurtSound = new Audio(heroHurtSound)
const getItemSound = new Audio(getItem)

export const initHeroes: Hero = {
    name: 'player 1',
    position: {
        isJumping: false, // Frame Saut
        isIdle: true, // Frame idle
        isShooting: false, //Frame attack
        isRunning: false, //Frame attack
        isHurting: false, // frame Hurt
        isDynamiting: false, // Dynamite Attack
        isRunningLeft: false,
        isCrouching: false,
        isDying: false
    },
    stopJump: false,
    isConflict: false, // test la collision
    score: 0,
    dynamite: 3,
    spriteHeight: 80,
    health: 100,
    width: 110,
    height: 100,
    x: 0,
    y: 454,
}
initHeroes.x = windowSize / 2 - initHeroes.width / 2

const spriteX = [-10, -126, -242, -358, -474, -590, -706, -822, -938, -1054]; // coordonnées X des sprites pour 10 frames
// 0 -> walk -100 -> Jump -200 -> Crouch -300 -> Walk Shoot  -400 -> Run -500 -> Die  -600 -> runShoot -700 -> crouchShoot -800 -> crouchDynamite -900->jumpShoot -1000 ->  Dynamite
const spriteY = [0, -100, -200, -300, -400, -500, -600, -700, -800, -900, -1000]; //bullet

const spriteValue = {
    isIdle: 0,
    isRunning: -400,
    isRunningLeft: -400,
    isJumping: -100,
    isCrouching: -200,
    isWalkingShoot: -300,
    isDying: -500,
    isHurting: -500,
    isRunningShooting: -600,
    isChrouchShooting: -700,
    isCrouchDynamiting: -800,
    isJumpingShooting: -900,
    isDynmating: -1000
}

const Hero = () => {
    const [{player: {width, height, x, y, position, stopJump}, gameOver, direction, sound, bullets, competency}, dispatch] = useGameData();
    useKeyPress();
    const refPosition = useRef(x)
    const refPositionY = useRef(y)
    const avatarRef = useRef(avatar)
    const delayRef = useRef<number | null>(null);
    useEffect(() => {
        if (!position.isIdle) {
            delayRef.current = 50;
        } else {
            delayRef.current = null;
        }
    }, [position])
    useEffect(() => {
        if (direction === 'right') {
            avatarRef.current = avatar
        } else {
            avatarRef.current = avatarLeft
        }
    }, [direction])
    useInterval(() => {
        if (gameOver) {
            delayRef.current = null;
        }
        const heroSize = direction === 'left' ? refPosition.current : refPosition.current + width
        competency.forEach((comp: Competency) => {
            if (!comp.catched && heroSize >= comp.x
                && heroSize <= comp.x + 50
            ) {
                if (sound) getItemSound.play();
                dispatch({type: 'GET_COMPETENCY', payload: {newComp: comp.type}})
            }
        })

        if (position.isJumping) {
            if (position.isRunning) {
                refPosition.current += 2
            }
            if (position.isRunningLeft) {
                refPosition.current -= 2
            }
            if (refPositionY.current <= 300) {
                dispatch({type: 'LAND_PLAYER'})
            }
            console.log(stopJump)
            if (stopJump) {
                refPositionY.current += 30
            } else {
                refPositionY.current -= 30
            }
            console.log(refPositionY.current)
            if (refPositionY.current >= initHeroes.y) {
                refPositionY.current = initHeroes.y
                dispatch({type: 'STOP_JUMPING'})
            }
        } else {
            if (position.isRunning) {
                refPosition.current += 10
            }
            if (position.isRunningLeft) {
                refPosition.current -= 10
            }
        }

        dispatch({type: 'ANIMATE_PLAYER', x: refPosition.current, y: refPositionY.current})

    }, delayRef.current);

    const [behavior, setBehavior] = useState(0)
    useLayoutEffect(() => {
        for (let [key, value] of Object.entries(position)) {
            if (value) {
                const va = (spriteValue as any)[key]
                setBehavior(va)
                return;
            }
        }
    }, [position])
    useEffect(() => {
        if (sound && position.isHurting && !gameOver) {
            hurtSound.currentTime = 0
            hurtSound.play()
            hurtSound.volume = 0.4
        } else {
            hurtSound.pause()
        }

    }, [sound, position])
    useEffect(() => {
        setTimeout(() => {
            if (position.isWalkingShoot)
                dispatch({type: 'STOP_SHOOTING'})
        }, 700)
    }, [position.isWalkingShoot])
    return (
        <>
            <Character width={width}
                       height={height}
                       x={x}
                       y={y}
                       avatar={avatarRef.current}
                       className="containerHero"
                       spriteX={spriteX}
                       behavior={behavior} />
            {bullets.length > 0 && bullets.map(({id, type}: IBulletProps) => <Bullet key={id}
                                                                                     id={id}
                                                                                     type={type} />)}
        </>
    )
}


export default Hero