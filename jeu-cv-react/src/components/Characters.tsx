import React, {useRef, useState, useEffect} from "react";
import { useInterval, useSpriteException} from "../helpers/helpers";
import {useGameData} from "../store/GameProvider";

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
    const [{player: {position}, gameOver, direction}, dispatch] = useGameData();
    const requestRef = useRef(spriteX[0]);
    const [sprite, setSprite] = useState(spriteX[0]);
    const [frame, setFrame] = useState(0);
    const value = useSpriteException()
    const id = useInterval(() => {
        setFrame(frame + 1);
        if (frame >= value) {
            if (position.isHurting) {
                if (gameOver) {
                    console.log('id player', id)
                    clearInterval(id)
                    return ;
                }
                dispatch({type: 'STOP_HURTING'})
            }
            setFrame(0);
        }
        requestRef.current = spriteX[frame]
        setSprite(requestRef.current);
    }, 100)
    const style = {
        width, height, left: x, top: y
    }
    useEffect(()=>{
        setFrame(0)
    }, [position])
    return (<div className={className} style={style}>
        <img alt="player" src={avatar} style={{left: sprite + 'px', top: behavior + 'px'}} /></div>)
}

export default Character