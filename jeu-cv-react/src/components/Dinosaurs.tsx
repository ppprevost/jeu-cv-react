import React, {useEffect, useRef, useState} from 'react';
import {windowSize} from "../constants/contants.tsx";
import raptorBleu from '../img/Dino/raptor-bleu.png';
import raptorVert from '../img/Dino/raptor-vert.png';
import pachy from '../img/Dino/pachy.png';
import {useAnimation} from "../helpers/helpers";

export interface IPropsDino {
    id:number,
    speed: number,
    x: number,
    y: number,
    avatar: string,
    className: string,
    width: string | number,
    height: string | number,
    spriteXDead: number[],
    health: number,
    spriteX: number[],
    spriteY: number[],
    widthDead: number,
    idSound: string,
    alive: true,
}

const Dinosaurs = ({x, y, width, height, avatar, spriteX}: IPropsDino) => {
    const style = {
        zIndex: 40,
        left: x + "px",
        top: y + "px",
        width: width + "px",
        height: height + "px",
        overflow: 'hidden'
    }
    const {sprite} = useAnimation(170, spriteX)
    return (<div className="dinosaurs" style={style}>
        <img src={avatar} style={{left: sprite || windowSize + 'px', top: 0 + 'px', position:'absolute'}} /></div>)

}

Dinosaurs.defaultProps = {
    id:1,
    speed: Math.round(Math.random() * 10) + 1, //random value for random speed
    x: windowSize,
    health: null,
    y: null,
    src: null,
    className: null,
    spriteX: null,
    spriteXDead: null,
    spriteY: null,
    width: null,
    widthDead: null,
    height: null,
    alive: true,
    idSound: null
}


export const raptorInit = {
    id:null,
    y: 410,
    x:windowSize,
    health: 200,
    avatar: raptorBleu,
    spriteX: [0, -249, -498, -747, -996, -1245, -1494, -1743],
    spriteXDead: [0, -249, -498, -747, -996, -1245, -1494, -1743, -1992, -2241],
    spriteY: [0, -150, -300, -450],
    width: 205,
    widthDead: 249,
    height: 150,
    idSound: 'raptor'

}

export default Dinosaurs;