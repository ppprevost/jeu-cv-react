import React, {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { useGameData } from "../store/GameProvider";
import avatar from "../img/hunter.png";
import avatarLeft from "../img/hunter_left.png";
import { useInterval, useKeyPress } from "../helpers/hooks";
import Character from "./Characters";
import heroHurtSound from "../sound/cri.mp3";
import {
  intervalSpeedHero,
  jumpSpeed,
  speedPlayer,
  stopJumpingHeight,
  widthCompetency
} from "../constants/contants";
import { Competency } from "./Competency";
import getItem from "../sound/OOT_Get_SmallItem1.mp3";
import { IHero, initHeroes } from "../data/player";
import { getCorrectSprite } from "../helpers/player_helpers";
import { usePlayerActions } from "../actions/player-actions";
import { State } from "../reducers/global_reducer";

const hurtSound = new Audio(heroHurtSound);
const getItemSound = new Audio(getItem);

const Hero: FunctionComponent<IHero & Partial<State>> = React.memo(
  ({
    width,
    height,
    x,
    y,
    position,
    stopJump,
    exactSpriteObject,
    gameOver,
    direction,
    sound,
    competency,
    windowInfo
  }) => {
    const avatarRef = useRef(direction === "right" ? avatar : avatarLeft);
    const {getCompetency, playerIsLanding, stopJumping, animatePlayer, stopShooting, } = usePlayerActions()
    const [behavior, setBehavior] = useState(0);
    const delayRef = useRef<number | null>(null);
    const refPosition = useRef(x);
    const refPositionY = useRef(y);
    const z = useInterval(() => {
      if (gameOver) {
        refPosition.current = initHeroes.x;
        refPositionY.current = initHeroes.y;
        delayRef.current = null;
        clearInterval(z);
      }
      competency &&
        competency.forEach((comp: Competency) => {
          if (
            !comp.catched &&
            comp.x >= x &&
            comp.x <= x + widthCompetency &&
            comp.y > refPositionY.current &&
            comp.y < refPositionY.current + height
          ) {
            if (sound) getItemSound.play();
            getCompetency(comp);
          }
        });
      if (position.isJumping) {
        if (position.isRunning) {
          refPosition.current += 15;
        }
        if (position.isRunningLeft) {
          refPosition.current -= 15;
        }
        if (refPositionY.current >= stopJumpingHeight) {
          playerIsLanding();
        }
        if (stopJump) {
          refPositionY.current -= jumpSpeed;
        } else {
          refPositionY.current += jumpSpeed;
        }
        if (refPositionY.current <= initHeroes.y) {
          refPositionY.current = initHeroes.y;
          stopJumping();
        }
      } else {
        // width/2 a little space for taking competency

        if (
          position.isRunning &&
          refPosition.current + width / 2 < windowInfo.windowSize
        ) {
          refPosition.current += speedPlayer;
        }
        if (position.isRunningLeft && refPosition.current + 40 > 0) {
          refPosition.current -= speedPlayer;
        }
      }
      animatePlayer(refPosition, refPositionY);
    }, delayRef.current);
    useEffect(() => {
      if (position.isIdle && !position.isHurting && !position.isDynamiting) {
        delayRef.current = null;
      } else {
        delayRef.current = intervalSpeedHero;
      }
    }, [position.isIdle, position.isHurting, position.isDynamiting]);
    useEffect(() => {
      if (direction === "right") {
        avatarRef.current = avatar;
        exactSpriteObject.left = exactSpriteObject.leftRightSide;
      } else {
        exactSpriteObject.left = exactSpriteObject.leftLeftSide;
        avatarRef.current = avatarLeft;
      }
    }, [direction, exactSpriteObject]);
    useLayoutEffect(() => {
      getCorrectSprite(position, setBehavior);
    }, [position]);
    useEffect(() => {
      if (sound && position.isHurting && !gameOver) {
        hurtSound.currentTime = 0;
        hurtSound.play();
        hurtSound.volume = 0.4;
      } else {
        hurtSound.pause();
      }
    }, [sound, position.isHurting, gameOver]);
    useEffect(() => {
      setTimeout(() => {
        if (position.isShooting) stopShooting();
      }, 700);
    }, [position.isShooting]);
    return (
      <>
        <Character
          width={width}
          height={height}
          position={position}
          x={x}
          y={y}
          exactSpriteObject={exactSpriteObject}
          avatar={avatarRef.current}
          className="containerHero"
          behavior={behavior}
        />
      </>
    );
  }
);

const MemoizedHero = (player: IHero) => {
  const [
    { gameOver, direction, sound, competency, windowInfo }
  ] = useGameData();
  useKeyPress();
  return (
    <Hero
      {...player}
      gameOver={gameOver}
      direction={direction}
      sound={sound}
      competency={competency}
      windowInfo={windowInfo}
    />
  );
};
export {Hero}
export default MemoizedHero;
