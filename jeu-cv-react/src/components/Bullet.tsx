import React, {useEffect, useState, useRef} from "react";
import bulletImg from "../img/item.png";
import {useInterval} from "../helpers/helpers";
import {useGameData} from "../store/GameProvider";
import {windowSize} from "../constants/contants.tsx";
import shotSound from '../sound/fusil.mp3';

export interface IBulletProps {
    id: number
    type: string
}
const rifleSound = new Audio(shotSound)

const BulletComponent = ({type, id}: IBulletProps) => {
    const [{player, dino, sound}, dispatch] = useGameData()
    const ref = useRef(player.x + 100);
    const spriteY = type === 'bullet' ? 0 : -13;
    const width = 29;
    const height = 13;
    const y = player.y;
    const [x, setX] = useState(player.x + 100);
    const spriteItemX = [0, -29, -58, -87, -116, -145, -174, -203, -232, -261];
    const avatar = bulletImg;
    const refDelayBullet:any = useRef(80)

    useEffect(() => {
        if(sound && player.position.isWalkingShoot){
        rifleSound.currentTime = 0
        rifleSound.volume = 0.4
        rifleSound.play();
        rifleSound.volume = 0.1;
        }else {
            rifleSound.pause();
        }
    }, [sound])
    const idS = useInterval(() => {
        ref.current = x + 30
        setX(ref.current)
        if (x >= windowSize || x < 0) {
            refDelayBullet.current = null
            return;
        }
        for (var i = 0; i < dino.length; i++) {
            if (dino[i].alive) {
                if (x + width >= dino[i].x && x + width <= dino[i].x + dino[i].width &&
                    y + height >= dino[i].y && y + height <= dino[i].y + dino[i].height) {
                     dispatch({type: 'STOP_BULLET', id});
                    refDelayBullet.current = null
                    if (type === 'bullet' && dino[i].className !== 'spike') {
                        dispatch({type: 'KILL_DINO', payload: {id: dino[i].id}});
                    } else {
                        dispatch({type: 'RAMPAGE'})
                    }
                }
            }
        }
    }, refDelayBullet.current)

    return (
        <div className="bullet"
             style={{left: x, top: y + 45, position: 'absolute', width, height: 13, overflow: 'hidden'}}>
            <img src={avatar} style={{left: spriteItemX[0] + 'px', top: spriteY + 'px', position: 'absolute'}} />
        </div>)
}

export default BulletComponent