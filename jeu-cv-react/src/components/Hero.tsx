import React, {FunctionComponent, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useGameData} from "../store/GameProvider";
import avatar from '../img/hunter.png';
import avatarLeft from "../img/hunter_left.png"
import {useInterval, useKeyPress} from "../helpers/hooks";
import Character from './Characters';
import heroHurtSound from '../sound/cri.mp3';
import Bullet from './Bullet';
import {intervalSpeedHero, jumpSpeed, speedPlayer, stopJumpingHeight, windowSize} from "../constants/contants";
import {Competency} from "./Competency";
import getItem from '../sound/OOT_Get_SmallItem1.mp3'
import {IHero, initHeroes} from "../data/player";
import {getCorrectSprite} from "../helpers/player_helpers";

const hurtSound = new Audio(heroHurtSound)
const getItemSound = new Audio(getItem)

const Hero: FunctionComponent<IHero> = ({width, height, x, y, position, stopJump}) => {
    const [{gameOver, direction, sound, bullets, competency}, dispatch] = useGameData();
    useKeyPress();
    const refPosition = useRef(x)
    const refPositionY = useRef(y)
    const avatarRef = useRef(direction === 'right' ? avatar : avatarLeft);
    const [behavior, setBehavior] = useState(0)
    const delayRef = useRef<number | null>(null);
    useEffect(() => {
        if (!position.isIdle) {
            delayRef.current = intervalSpeedHero;
        } else {
            delayRef.current = null;
        }
    }, [position, delayRef.current])
    useEffect(() => {
        if (direction === 'right') {
            avatarRef.current = avatar
        } else {
            avatarRef.current = avatarLeft
        }
    }, [direction, avatarRef.current])
    useInterval(() => {
        if (gameOver) {
            delayRef.current = null;
        }
        const heroSize = direction === 'left' ? refPosition.current : refPosition.current + (width / 3)
        competency.forEach((comp: Competency) => {
            if (!comp.catched && heroSize >= comp.x
                && heroSize <= comp.x + 50 && comp.y > refPositionY.current && comp.y < refPositionY.current + height
            ) {
                if (sound) getItemSound.play();
                dispatch({type: 'GET_COMPETENCY', payload: {newComp: comp.type}})
            }
        })
        if (position.isJumping) {
            if (position.isRunning) {
                refPosition.current += 15
            }
            if (position.isRunningLeft) {
                refPosition.current -= 15
            }
            if (refPositionY.current <= stopJumpingHeight) {
                dispatch({type: 'LAND_PLAYER'})
            }
            if (stopJump) {
                refPositionY.current += jumpSpeed
            } else {
                refPositionY.current -= jumpSpeed
            }
            if (refPositionY.current >= initHeroes.y) {
                refPositionY.current = initHeroes.y
                dispatch({type: 'STOP_JUMPING'})
            }
        } else {
            // width/2 a little space for taking competency
            if (position.isRunning && (refPosition.current + width / 2 < windowSize)) {
                refPosition.current += speedPlayer
            }
            if (position.isRunningLeft && (refPosition.current + 40 > 0)) {
                refPosition.current -= speedPlayer
            }
        }
        dispatch({type: 'ANIMATE_PLAYER', x: refPosition.current, y: refPositionY.current})
    }, delayRef.current);

    useLayoutEffect(() => {
        getCorrectSprite(position, setBehavior)
    }, [position]);
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
        console.log(position.isShooting)
        setTimeout(() => {
            if (position.isShooting)
                dispatch({type: 'STOP_SHOOTING'})
        }, 700)
    }, [position.isShooting])
    return (
        <>
            <Character width={width}
                       height={height}
                       x={x}
                       y={y}
                       avatar={avatarRef.current}
                       className="containerHero"
                       behavior={behavior} />
            {bullets.length > 0 && bullets
                .map((bull) => <Bullet key={bull.id}
                                       {...bull} />)}
        </>
    )
}


export default Hero