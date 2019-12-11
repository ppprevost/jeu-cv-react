import React, {useState} from 'react';
import {windowSize} from "../constants/contants.tsx";

interface IProps {
    step: number,
    x: number,
    y: number,
    src: string,
    className: string,
    width: string | number,
    height: string | number,
    spriteXDead: number[],
    health: number,
    spriteX: number[],
    spriteY: number[],
    widthDead: number,
    soundClass: string,
    alive: true,
}

const Dinosaurs = (props: IProps) => {
    const x = props.x || windowSize
    const [move, setMove] = useState(x);
    const [sprite, setSprite] = useState(0)
    const dinoStyle: any = {
        'z-index': '40',
        'position': 'absolute',
        'left': props.x + "px",
        'top': props.y + "px",
        'width': props.width + "px",
        'height': props.height + "px",
        'overflow': 'hidden'
    }

    const animation = (outOfTheBox: number) => {
        setMove(() => (x) - props.step)
        if (move < outOfTheBox) {
            console.log('end')
        }
        window.requestAnimationFrame(function () {
            animation(80);
        });
    }



    return (
        <div id="obstacle">
            <div
                style={dinoStyle}
                className={props.className}
            >
                <img src={props.src} alt="" style={{
                    position: 'absolute',
                    top: props.alive ? props.spriteY[0] : props.spriteY[1],
                    left: props.alive ? props.spriteX[sprite] : props.spriteXDead[sprite]
                }} />
            </div>
        </div>
    )
}

Dinosaurs.defaultProps = {
    step: Math.round(Math.random() * 10) + 1, //random value for random speed
    x: windowSize,
    energie: null,
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
}

const Diplo = () => {
    const referenceDiplo = {
        y: 425,
        spriteXDead: [0, -228, -456, -684, -912, -1140, -1368, -1596, -1824, -2052],
        health: 100,
        src: 'img/Dino/diplo.png',
        className: 'containerDiplo',
        spriteX: [0, -228, -456, -684, -912, -1140, -1368, -1596],
        spriteY: [-15, -150, -300, -450],
        width: 185,
        widthDead: 228,
        height: 130,
        soundClass: 'diplo'
    };

    const {className, src, spriteX, health, width, widthDead, height, soundClass} = referenceDiplo;
    return <Dinosaurs
        className={className}
        src={src}
        spriteX={spriteX}
        health={health}
        width={width}
        widthDead={widthDead}
        height={height}
        soundClass={soundClass}
    />

}