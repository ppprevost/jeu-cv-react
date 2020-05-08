import React from 'react';
import {useState} from "react";
import {useInterval} from "../helpers/hooks";
import {IPropsDino} from "./Virus";
import explodeImg from "../img/dynamite.png"
import ExplosionContainer from "./SpriteElement";
import {explodeInit} from "../data/explode";

const Explosion = ({x, y}: Pick<IPropsDino, 'x'|'y'>) => {
    const [sprite, setSprite] = useState(explodeInit.spriteX[0]);
    const [frame, setFrame] = useState(0)
    useInterval(() => {
        setFrame(frame + 1)
        setSprite(explodeInit.spriteX[frame])
        if (explodeInit.spriteX.length === frame) {

        }
    }, explodeInit.delayIntervalSprite)
    return <ExplosionContainer
        x={x}
        y={y}
        className={"explosion"}
        zIndex = {2000}
        width={explodeInit.width}
        height={explodeInit.height}
        src={explodeImg}
        sprite={sprite}
     />
}


export default Explosion