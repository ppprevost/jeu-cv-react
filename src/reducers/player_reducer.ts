import {
  ADD_PLAYER,
  ANIMATE_PLAYER,
  COLLISION,
  IDLE,
  IS_CROUCHING,
  JUMP,
  LAND_PLAYER,
  MOVE_LEFT,
  MOVE_RIGHT,
  SHOOT,
  STOP_HURTING,
  STOP_JUMPING,
  STOP_SHOOTING
} from "../constants";
import { initHeroes } from "../data/player";
import { repercutPositionHero } from "../helpers/main_helpers";
import { bulletInit, dynamiteInit } from "../data/bullet";
import { ActionType, ExistingHero, State } from "./global_reducer";
import shotSound from "../sound/fusil.mp3";
import marioPain from "../sound/sm64-mario-pain.mp3";
import marioGameOverSound from "../sound/super-mario-64-voice-clips-and-sound-effects.mp3";
import soundGameOver from "../sound/super-mario-world-death-on-piano.mp3";

import marioIsJumping from "../sound/super-mario-bros_jump.mp3";
const marioPainSound = new Audio(marioPain);
const jumpSound = new Audio(marioIsJumping);
const gameOverSound = new Audio(marioGameOverSound);
const gameOverSoundMusic = new Audio(soundGameOver);
const reducer = (state: ExistingHero, action: ActionType) => {
  switch (action.type) {
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
    case "IS_DOCTOR":
      state.player.maskEfficient += 3;
      return repercutPositionHero(state, "isDoctor");

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
        if (state.player.position.isDoctor) {
          const actualDino = state.dino.findIndex(
              elem => elem.id === action.id
          );
          if (actualDino) {
            state.dino.splice(actualDino, 1);
            state.player.maskEfficient--;
          }
          if(state.player.maskEfficient <= 0){
            repercutPositionHero(state,"isDoctor", true)
            state.player.position.maskEfficient = 0;
            return repercutPositionHero(state,"isDoctor", true)
          }
          return { ...state };
        } else {

          if (hurtedPlayerState.player && hurtedPlayerState.player.health > 0) {
            hurtedPlayerState.player.health -= 10;
          }

          if (
            hurtedPlayerState &&
            hurtedPlayerState.player &&
            hurtedPlayerState.player.health <= 0
          ) {
            gameOverSoundMusic.play().then(() => {
              gameOverSound.play();
            });
            hurtedPlayerState.gameOver = true;
            hurtedPlayerState.player = null;
          }
          marioPainSound.play();
          marioPainSound.volume = 0.2;
          return { ...hurtedPlayerState };
        }
      }
      return { ...state };
    case ANIMATE_PLAYER:
      return {
        ...state,
        player: { ...state.player, x: action.x, y: action.y }
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
      jumpSound.pause();
      jumpSound.currentTime = 0;
      jumpSound.play();
      jumpSound.volume = 0.07;
      return repercutPositionHero(state, "isJumping");
    default:
      return state;
  }
};

export default reducer;
