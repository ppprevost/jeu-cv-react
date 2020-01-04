import {initHeroes, spriteValue} from "../data/player";
import {SetStateAction} from "react";

export const getCorrectSprite = (position: typeof initHeroes.position, setBehavior: SetStateAction<any>) => {
    if (position.isHurting) {
        return setBehavior(spriteValue.isHurting)
    }
    if (position.isShooting) {
        if (position.isRunning || position.isRunningLeft) {
            return setBehavior(spriteValue.isRunningShooting)
        }
        if (position.isIdle) {
            return setBehavior(spriteValue.isWalkingShoot)
        }
        if (position.isJumping) {
            return setBehavior(spriteValue.isJumpingShooting)
        }
    }
    if (position.isCrouching) {
        if (position.isShooting) {
            return setBehavior(spriteValue.isChrouchShooting)
        }
    }
    if (position.isDynamiting) {
        if (position.isCrouching) {
            return setBehavior(spriteValue.isCrouchDynamiting)
        }
        return setBehavior(spriteValue.isDynamiting)

    }
    for (let [key, value] of Object.entries(position)) {
        if (value) {
            const va = (spriteValue as any)[key]
            return setBehavior(va)
        }
    }
    return position
}