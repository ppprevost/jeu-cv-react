import React from "react";
import {useAnimation} from "../helpers/helpers";

interface PropsCharacter {
    width:number,
    height:number,
    x:number,
    y:number,
    className:string,
    spriteX: number[],
    avatar:string
    behavior: number
}

const Character = ({width, height, x,y, className, spriteX, behavior, avatar}:PropsCharacter)=> {
    const {sprite} = useAnimation(70, spriteX);
    const style = {
        width, height, left: x, top: y
    }

    return (<div className={className} style={style}>
        <img src={avatar} style={{left: sprite + 'px', top: behavior + 'px'}} /></div>)
}

export default Character