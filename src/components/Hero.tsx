import React, {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { useGameData } from "../store/GameProvider";
import avatar from "../img/mario_right.png";
import avatarLeft from "../img/mario.png";
import { useInterval, useKeyPress } from "../helpers/hooks";
import Character from "./Characters";
import heroHurtSound from "../sound/cri.mp3";
import marioIsJumping from "../sound/super-mario-bros_jump.mp3";

import {
  casesConstant,
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
    bonus,
    misc,
    x,
    y,
    position,
      pangolin,
    stopJump,
    exactSpriteObject,
    gameOver,
    direction,
    sound,
    competency,
    windowInfo
  }) => {
    const [, dispatch] = useGameData();
    const avatarRef = useRef(direction === "right" ? avatar : avatarLeft);
    const { playerIsLanding, stopJumping, animatePlayer } = usePlayerActions();
    const [behavior, setBehavior] = useState(0);
    const delayRef = useRef<number | null>(intervalSpeedHero);
    const refPosition = useRef(x);
    const refPositionY = useRef(y);
    useInterval(() => {
      Object.values(bonus).forEach((comp: any) => {
        if (
          comp.left >= x &&
          comp.left <= x + exactSpriteObject.width + exactSpriteObject.left &&
          comp.bottom >= refPositionY.current &&
          comp.bottom <=
            refPositionY.current +
              (exactSpriteObject.height + exactSpriteObject.bottom)
        ) {
          playerIsLanding();
          if (!comp.hit) dispatch({ type: "HIT", payload: comp });

        }
      });
      misc &&
        Object.values(misc).forEach((mis: any) => {
          if (
            mis.x >= x &&
            mis.x + mis.width <= x + width &&
            mis.y >= refPositionY.current &&
            mis.y <= refPositionY.current + height / 2 && mis.type=== 'mask'
          ) {
            dispatch({ type: "IS_DOCTOR" });
            if (sound) getItemSound.play();
          }
        });
      pangolin && Object.values(pangolin).forEach(pang=>{
        if (
            pang.x >= x &&
            pang.x + pang.width <= x + width &&
            pang.y >= refPositionY.current &&
            pang.y <= refPositionY.current + height / 2
        ) {
          console.log(': ', );
          dispatch({ type: "CHASE_PANGOLIN", payload:pang });
        }
      })
    }, 30);

    useInterval(() => {
      if (gameOver) {
        refPosition.current = initHeroes.x;
        refPositionY.current = initHeroes.y;
        delayRef.current = null;
      }
      if (position.isJumping) {
        if (position.isRunning) {
          refPosition.current += speedPlayer;
        }
        if (position.isRunningLeft) {
          refPosition.current -= speedPlayer;
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
      } else {
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

    return (
      <>
        <Character
          direction={direction}
          width={width}
          height={height}
          position={position}
          x={x}
          y={refPositionY.current}
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
    { gameOver, direction, sound, competency, windowInfo, bonus, misc, pangolin }
  ] = useGameData();
  useKeyPress();
  return (
    <Hero
      {...player}
      gameOver={gameOver}
      pangolin={pangolin}
      misc={misc}
      bonus={bonus}
      direction={direction}
      sound={sound}
      competency={competency}
      windowInfo={windowInfo}
    />
  );
};
export { Hero };
export default MemoizedHero;
