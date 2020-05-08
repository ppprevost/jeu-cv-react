import virus from '../img/virus.png'
import virusLeft from '../img/virus_left.png'
import pangoLeft from '../img/pango_left.png';
import pangoRight from '../img/pango_right.png';


export interface EnemyInit {
    x?: number,
    y: number,
    exactSpriteObject?:any
    avatar: string | string[]
    spriteX?: number[]
    spriteXDead?: number[]
    width: number
    direction?:'left' | 'right';
    height: number
    widthDead?: number
    idSound?: string
    className: string
    spriteY?: number[]
    health?: number
}

export const virusInit = {
    height:40,
    width:40,
    className:"virus",
    avatar: [virusLeft, virus]
};

export const pangInit = {
    height:50,
    width:83,
    className:'pangolin',
    avatar:[pangoLeft, pangoRight]

}
