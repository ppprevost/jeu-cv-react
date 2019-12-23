import React, {useEffect, useState, useRef} from "react";
import bulletImg from "../img/item.png";
import {useInterval} from "../helpers/hooks";
import {useGameData} from "../store/GameProvider";
import {windowSize} from "../constants/contants";
import BulletSprite from "./SpriteElement"

export interface IBulletProps {
    id: number
    type: string
}

const BulletComponent = ({type, id}: IBulletProps) => {
    const [{player, dino, direction}, dispatch] = useGameData();
    const ref = useRef(player.x + 100);
    const refDirection = useRef(null)
    const spriteY = type === 'bullet' ? 0 : -13;
    const width = 29;
    const height = 13;
    const y = player.position.isCrouching ? player.y + 65 : player.y + 45;
    const [x, setX] = useState(0);
    const spriteItemX = [0, -29, -58, -87, -116, -145, -174, -203, -232, -261];
    const avatar = bulletImg;
    const refDelayBullet: any = useRef(40)
    useEffect(() => {
        setX(player.x + 100)
    }, [])
    useEffect(() => {
        refDirection.current = direction

    }, [])
    useInterval(() => {
        console.log(refDirection.current)
        if (refDirection.current === 'right') {
            ref.current = x + 30
        } else {
            ref.current = x - 30
        }
        setX(ref.current)
        if (x >= windowSize || x < 0) {
            refDelayBullet.current = null
            return;
        }
        const directionBullet = player.direction === 'left' ? x : x + width
        for (var i = 0; i < dino.length; i++) {
            if (dino[i].alive) {
                if (
                    x >= dino[i].x
                    && x <= dino[i].x + dino[i].width
                    && y + height >= dino[i].y
                    && y + height <= dino[i].y + dino[i].height) {
                    dispatch({type: 'STOP_BULLET', id});
                    refDelayBullet.current = null
                    if (type === 'bullet') {
                        if (dino[i].className !== 'spike') {
                            dispatch({type: 'KILL_DINO', payload: {id: dino[i].id}});
                        }
                    } else {
                        dispatch({type: 'RAMPAGE'})
                    }
                }
            }
        }
    }, refDelayBullet.current)

    return (
        <BulletSprite
        className={"bullet"}
        width={width}
        height={13}
        y={y}
        x={refDirection.current == 'right' ? x : x - player.width}
        src={avatar}
        behavior={spriteY}
        sprite={spriteItemX[0]}
        />
       )
}

export default BulletComponent