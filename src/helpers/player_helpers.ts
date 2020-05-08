import {initHeroes, spriteValue} from "../data/player";
import {SetStateAction} from "react";

export const getCorrectSprite = (position: typeof initHeroes.position, setBehavior: SetStateAction<any>) => {
    if (position.isCrouching) {
        if (position.isShooting) {
            return setBehavior(spriteValue.isChrouchShooting)
        }
    }
    for (let [key, value] of Object.entries(position)) {
        if (value) {
            const va = (spriteValue as any)[key]
            return setBehavior(va)
        }
    }
    return position
}