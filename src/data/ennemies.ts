import spike from "../img/Dino/spike.png";
import vine from "../img/Dino/vine.png";
import raptorBleu from "../img/Dino/raptor-bleu.png";
import raptorVert from "../img/Dino/raptor-vert.png";
import pachy from "../img/Dino/pachy.png";
import ptero from "../img/Dino/ptero.png";
import pteroLeft from "../img/Dino/ptero_left.png";
import diplo from "../img/Dino/diplo.png";
import diploLeft from "../img/Dino/diplo_left.png";

export interface EnemyInit {
    x?: number,
    y: number,
    exactSpriteObject?:any
    avatar: string | string[]
    spriteX?: number[]
    spriteXDead?: number[]
    width: number
    height: number
    widthDead?: number
    idSound?: string
    className: string
    spriteY?: number[]
    health?: number
}

export const peaksInit = {
    y: 30,
    avatar: [spike],
    className: "spike",
    width: 70,
    height: 60,

}

export const vinesInit = {
    y: 90,
    avatar: [vine],
    className: "vine",
    width: 41,
    height: 477,
}

export const raptorInit = (): EnemyInit => {
    const raptorArray = [raptorBleu, raptorVert, pachy]
    const randomIndex = Math.round(Math.random() * 2)
    const raptorChoice = raptorArray[randomIndex]
    return ({
        y: 23,
        className: 'raptor',
        health: 200,
        exactSpriteObject: {
            height:130,
            width:100,
            top:30
        },
        avatar: [raptorChoice],
        spriteX: [0, -249, -498, -747, -996, -1245, -1494, -1743],
        spriteXDead: [0, -249, -498, -747, -996, -1245, -1494, -1743, -1992, -2241],
        spriteY: [0, -150, -300, -450],
        width: 205,
        widthDead: 249,
        height: 150,
        idSound: 'raptor'
    })
}

export const pteroInit: EnemyInit = {
    y: 200,
    avatar: [ptero, pteroLeft],
    className: 'ptero',
    spriteX: [0, -128, -256, -384, -512],
    spriteY: [0, -100],
    width: 128,
    height: 100,
    idSound: "ptero"
}

export const diploInit: EnemyInit = {
    y: 32,
    exactSpriteObject: {
        height:110,
        width:100,
        top:30
    },
    spriteXDead: [0, -228, -456, -684, -912, -1140, -1368, -1596, -1824, -2052],
    health: 100,
    avatar: [diplo, diploLeft],
    className: 'containerDiplo',
    spriteX: [0, -228, -456, -684, -912, -1140, -1368, -1596],
    spriteY: [-15, -150, -300, -450],
    width: 185,
    widthDead: 228,
    height: 140,
    idSound: "diplo"
}

