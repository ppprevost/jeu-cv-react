import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {windowSize} from "../constants/contants.tsx";
import raptorBleu from '../img/Dino/raptor-bleu.png';
import raptorVert from '../img/Dino/raptor-vert.png';
import pachy from '../img/Dino/pachy.png';
import ptero from '../img/Dino/ptero.png'
import {useAnimation, useMoving} from "../helpers/helpers";
import raptorNoise from '../sound/141.mp3';
import pteroNoise from '../sound/16456.mp3';
import {useGameData} from "../store/GameProvider";

export interface IPropsDino {
    id: number,
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

export const useMovingDinosaur = (tempo: number, id: number, x: number) => {
    const [, dispatch] = useGameData();
    //const actualDino = dino.find((din:IPropsDino)=>din.id===id)
    const refPosition = useRef(x)
    const [positionX, setPositionX] = useState(x);
    const refCancel = useRef(x)
    let animateRequestFrame = (tempo: number) => {
        let tActuel;
        let tPrecedent: number;
        let moving = function (actuel: number) {
            tActuel = actuel;
            tPrecedent = tPrecedent || actuel;
            let delai = tActuel - tPrecedent;
            if (delai > tempo) {
                if (refPosition.current < 30) {
                    dispatch({type: 'DELETE_DINO', payload: {id}})
                    cancelAnimationFrame(refCancel.current)
                    return;
                }
                refPosition.current -= 5
                setPositionX(refPosition.current)
                dispatch({type: 'MOVE_DINO', payload: {x: positionX, id}})
                tPrecedent = tActuel;
            }
            refCancel.current = requestAnimationFrame(moving);
        };
        moving(tempo)
    }
    useLayoutEffect(() => {
        animateRequestFrame(tempo)
        return () => cancelAnimationFrame(refCancel.current)
    }, [])

    return positionX
}

const Dinosaurs = ({id, x, y, width, height, avatar, spriteX, className, idSound}: IPropsDino) => {
    const [{sound}] = useGameData()
    const positionX = useMovingDinosaur(25, id, x)
    const style = {
        zIndex: 40,
        left: positionX + "px",
        top: y + "px",
        width: width + "px",
        height: height + "px",
        overflow: 'hidden'
    }
    useEffect(() => {
        const soundDino = new Audio(idSound ==='raptor'? raptorNoise: pteroNoise)
        console.log('sound: ', sound);
        if (sound) {
            soundDino.volume=0.3
            soundDino.play()
        }
        else {soundDino.pause()}
    }, [sound])

    const {sprite} = useAnimation(170, spriteX)
    return (
        <div className={`dinosaurs ${className}`} style={style}>
            <img src={avatar} style={{left: sprite + 'px', top: 0 + 'px', position: 'absolute'}} />
        </div>
    )


}

Dinosaurs.defaultProps = {
    id: 1,
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


export const raptorInit = () => {
    const raptorArray = [raptorBleu, raptorVert, pachy]
    const randomIndex = Math.round(Math.random() * 2)
    const raptorChoice = raptorArray[randomIndex]
    return ({
        y: 410,
        className: 'raptor',
        x: windowSize,
        health: 200,
        avatar: raptorChoice,
        spriteX: [0, -249, -498, -747, -996, -1245, -1494, -1743],
        spriteXDead: [0, -249, -498, -747, -996, -1245, -1494, -1743, -1992, -2241],
        spriteY: [0, -150, -300, -450],
        width: 205,
        widthDead: 249,
        height: 150,
        idSound: 'raptor'
    })
}

const pteroInit = () => (
    {
        y: 282,
        health: 60,
        avatar: ptero,
        className: 'containerPtero',
        spriteX: [0, -128, -256, -384, -512],
// 	//0 -> Attack  -100 -> Run
        spriteY: [0, -100],
        spriteXDead: [],
        width: 128, // retranchement de 28px
        height: 100,
        idSound: "ptero"
    }
)


export const addDinosaurs = (dinosaur: any) => {
    console.log('go to the add dinosaur method', dinosaur)
            return <Dinosaurs {...dinosaur} key={dinosaur.id} />
}

export const createDinosaur = () => {
    const tableDinosaur = [pteroInit(), raptorInit()]
    const random = Math.round(Math.random() )
    return tableDinosaur[random]
}

export default Dinosaurs;