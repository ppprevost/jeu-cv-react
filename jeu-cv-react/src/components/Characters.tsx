import React, {useRef, useState, useEffect} from "react";
import {useInterval, useSpriteException} from "../helpers/hooks";
import {useGameData} from "../store/GameProvider";
import HeroSprite from "./SpriteElement"

interface PropsCharacter {
    width: number,
    height: number,
    x: number,
    y: number,
    className: string,
    spriteX: number[],
    avatar: string
    behavior: number
}

const Character = ({width, height, x, y, className, spriteX, behavior, avatar}: PropsCharacter) => {
    const [{player: {position}, gameOver}, dispatch] = useGameData();
    const requestRef = useRef(spriteX[0]);
    const delayRef = useRef<number | null>(100);
    const [sprite, setSprite] = useState(spriteX[0]);
    const [frame, setFrame] = useState(0);
    const value = useSpriteException()
    useInterval(() => {
        setFrame(frame + 1);
        if (frame >= value) {
            if (position.isHurting) {
                if (gameOver) {
                    delayRef.current = null
                }
                dispatch({type: 'STOP_HURTING'})
            }
            setFrame(0);
        }
        requestRef.current = spriteX[frame]
        setSprite(requestRef.current);
    }, delayRef.current)

    useEffect(() => {
        setFrame(0)
    }, [position, behavior])
    useEffect(() => {
        delayRef.current = null
        setFrame(0)
        if (position.isDynamiting && position.isCrouching) {
            setFrame(0)
            delayRef.current = 400
        } else if (position.isDynamiting) {
            setFrame(0)
            delayRef.current = 200
        } else {
            delayRef.current = 100
        }
    }, [position.isDynamiting])
    return <HeroSprite
        className={className}
        src={avatar}
        behavior={behavior}
        x={x}
        y={y}
        width={width}
        height={height}
        sprite={sprite}
    />
}

export default Character