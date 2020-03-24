import {
    ADD_PLAYER,
    ANIMATE_PLAYER, COLLISION,
    IDLE,
    IS_CROUCHING, JUMP, LAND_PLAYER,
    MOVE_LEFT,
    MOVE_RIGHT,
    SHOOT, STOP_HURTING,
    STOP_JUMPING,
    STOP_SHOOTING
} from "../constants";
import {initHeroes} from "../data/player";
import {repercutPositionHero} from "../helpers/main_helpers";
import {bulletInit, dynamiteInit} from "../data/bullet";
import {ActionType, ExistingHero, State} from "./global_reducer";
import shotSound from "../sound/fusil.mp3";
import hornSound from "../sound/the-price-is-right-losing-horn.mp3";

const rifleSound = new Audio(shotSound);
const hornSoundMP3 = new Audio(hornSound);
const reducer = (state:ExistingHero, action:ActionType) => {
    switch(action.type){
        case MOVE_RIGHT:
            state.direction = "right";
            return repercutPositionHero(state, "isRunning", action.stop);
        case MOVE_LEFT:
            state.direction = "left";
            return repercutPositionHero(state, "isRunningLeft", action.stop);
        case IDLE:
            return repercutPositionHero(state, "isIdle");
        case IS_CROUCHING:
            return repercutPositionHero(state, "isCrouching", action.stop);
        case "IS_DYNAMITING":
            if (state.player && state.player.dynamite > 0) {
                state.idBullet++;
                state.player.dynamite -= 1;
                state.bullets = [
                    ...state.bullets,
                    { ...dynamiteInit, id: state.idBullet }
                ];
                return repercutPositionHero(state, "isDynamiting");
            }
            return { ...state };
        case SHOOT:
            if (!state.win && !state.pause) {
                state.idBullet++;
                const newBullet = { ...bulletInit, id: state.idBullet };
                state.bullets = [...state.bullets, newBullet];
                if (state.sound) {
                    rifleSound.currentTime = 0;
                    rifleSound.volume = 0.2;
                    rifleSound.play();
                } else {
                    rifleSound.pause();
                }
                return repercutPositionHero(state, "isShooting");
            }
            break;
        case STOP_SHOOTING:
            return repercutPositionHero(state, "isShooting", true);
        case STOP_JUMPING:
            if (state.player) {
                state.player.stopJump = false;
            }
            return repercutPositionHero(state, "isJumping", true);
        case COLLISION:
            if (!state.player.position.isHurting) {
                const hurtedPlayerState = repercutPositionHero(state, "isHurting");
                if (hurtedPlayerState.player && hurtedPlayerState.player.health > 0) {
                    hurtedPlayerState.player.health -= 10;
                }
                if (
                    hurtedPlayerState &&
                    hurtedPlayerState.player &&
                    hurtedPlayerState.player.health <= 0
                ) {
                    hornSoundMP3.play();
                    hurtedPlayerState.gameOver = true;
                    hurtedPlayerState.player = null;
                }
                return { ...hurtedPlayerState };
            }
            return { ...state };
        case ANIMATE_PLAYER:
            return {
                ...state,
                player: { ...state.player, x: action.x, y: action.y ? action.y : {} }
            };
        case LAND_PLAYER:
            if (state.player) {
                state.player.stopJump = true;
            }
            return { ...state };
        case STOP_HURTING:
            if (state.player && state.player.health > 0) {
                return repercutPositionHero(state, "isHurting", true);
            }
            return { ...state };
        case JUMP:
            return repercutPositionHero(state, "isJumping");
        default:
            return state;
    }

};

export default reducer;
