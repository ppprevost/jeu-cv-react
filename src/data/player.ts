
export interface IHero {
  name: string | null;
  email: string | null;
  position: any;
  stopJump: boolean;
  isConflict: boolean;
  score: number;
  direction: 'left' | 'right';
  dynamite?: number;
  spriteHeight: number;
  health: number;
  exactSpriteObject: any;
  width: number;
  height: number;
  x: number;
  y: number;
  maskEfficient:number;
}

export const initHeroes: IHero = {
  name: null,
  email: null,
  maskEfficient:0,
  exactSpriteObject: {
    height: 116,
    width: 70,
    left:20,
    bottom:30
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
  width: 117,
  height: 168,
  x: window.innerWidth / 2 - 110/2,
  y: 0
};

export const spriteX = [
  0,
   - 117,
   - 117*2+2,
   - 117*3+2,
   - 117*4+2,
   - 117*5+2,
   - 117*6+2,
]; // coordonnées X des sprites pour 10 frames
// 0 -> walk -100 -> Jump -200 -> Crouch -300 -> Walk Shoot  -400 -> Run -500 -> Die  -600 -> runShoot -700 -> crouchShoot -800 -> crouchDynamite -900->jumpShoot -1000 ->  Dynamite

export const spriteValue = {
  isIdle: -1,
  isRunning: -2,
  isRunningLeft: -2,
  isJumping: -306,
  isCrouching: -200,
  isDying: -500,
  isChrouchShooting: -700,
};
