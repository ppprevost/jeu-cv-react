import { windowSize } from "../constants/contants";

export interface IHero {
  name: string | null;
  email: string | null;
  position: any;
  stopJump: boolean;
  isConflict: boolean;
  score: number;
  direction: string;
  dynamite: number;
  spriteHeight: number;
  health: number;
  exactSpriteObject: any;
  width: number;
  height: number;
  x: number;
  y: number;
}

export const initHeroes: IHero = {
  name: null,
  email: null,
  exactSpriteObject: {
    height: 92,
    width: 60
  },
  position: {
    isJumping: false, // Frame Saut
    isIdle: true, // Frame idle
    isShooting: false, //Frame attack
    isRunning: false, //Frame attack
    isHurting: false, // frame Hurt
    isDynamiting: false, // Dynamite Attack
    isRunningLeft: false,
    isCrouching: false,
    isDying: false
  },
  stopJump: false,
  direction: "right",
  isConflict: false, // test la collision
  score: 0,
  dynamite: 3,
  spriteHeight: 80,
  health: 100,
  width: 110,
  height: 100,
  x: 0,
  y: 454
};
initHeroes.x = windowSize / 2 - initHeroes.width / 2; // initial position of the player

export const spriteX = [
  -10,
  -126,
  -242,
  -358,
  -474,
  -590,
  -706,
  -822,
  -938,
  -1054
]; // coordonnées X des sprites pour 10 frames
// 0 -> walk -100 -> Jump -200 -> Crouch -300 -> Walk Shoot  -400 -> Run -500 -> Die  -600 -> runShoot -700 -> crouchShoot -800 -> crouchDynamite -900->jumpShoot -1000 ->  Dynamite

export const spriteValue = {
  isIdle: 0,
  isRunning: -400,
  isRunningLeft: -400,
  isJumping: -100,
  isCrouching: -200,
  isWalkingShoot: -300,
  isDying: -500,
  isHurting: -500,
  isRunningShooting: -600,
  isChrouchShooting: -700,
  isCrouchDynamiting: -800,
  isJumpingShooting: -900,
  isDynamiting: -1000
};
