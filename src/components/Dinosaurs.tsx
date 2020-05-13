import React, { useEffect, useRef, useState } from "react";
import { dinoSpeed, intervalSpeedDino } from "../constants/contants";
import { useInterval } from "../helpers/hooks";
import { useGameData } from "../store/GameProvider";
import Explosion from "./Explosion";
import DinosaurSprite from "./SpriteElement";
import {
  conditionToConflict,
  takeSoundChoice
} from "../helpers/ennemies_helpers";

import useActionDinosaurs from "../actions/dinosaurs-actions";

export interface IPropsDino {
  id: number;
  speed: number;
  x: number;
  y: number;
  avatar: string;
  className: string;
  width: number;
  height: number;
  spriteXDead?: number[];
  health: number;
  spriteX?: number[];
  exactSpriteObject?: any;
  spriteY?: number[];
  widthDead?: number;
  idSound?: string;
  alive: boolean;
}

const Dinosaurs = React.memo(({
  id,
  x,
  y,
  width,
  widthDead = 0,
  height,
  avatar,
  spriteX = [],
  spriteY = [],
  spriteXDead = [],
  className,
  idSound = "",
  speed,
  alive,
  exactSpriteObject
}: IPropsDino) => {
  const [
    {
      sound,
      player,
      direction,
      gameOver,
      win,
      windowInfo: { windowSize },
        gameType,
    }
  ] = useGameData();
  const [frame, setFrame] = useState(0);
  const requestRef = useRef(spriteX[0]);
  const [typeSprite, setTypeSprite] = useState(0);
  const refPosition = useRef(x);
  const positionInitial = useRef(0);
  const delayDinosaur = useRef<number | null>(intervalSpeedDino);
  const { deleteDinosaurs, collision, moveDinosaurs } = useActionDinosaurs();
  useEffect(() => {
    positionInitial.current = x;
  }, []);


  useInterval(() => {
    const positionHero =
      direction === "left"
        ? player.x
        : player.x + player.exactSpriteObject.width;
    if (
      alive &&
      conditionToConflict(
        className,
        positionHero,
        refPosition,
        exactSpriteObject ? exactSpriteObject.width : width,
        player,
        y,
        height
      )
    ) {
      collision();
    }
    if (positionInitial.current === -width) {



      if (refPosition.current > windowSize + width) {
        deleteDinosaurs(id);
        delayDinosaur.current = null;
        return;
      } else {
        refPosition.current += dinoSpeed + speed;
        moveDinosaurs(refPosition, id);
      }
    } else {

      if (refPosition.current < -width) {
        deleteDinosaurs(id);
        delayDinosaur.current = null;
        return;
      } else {
        if(gameType==="tutorial" && (refPosition.current - player.x )<= 200){
          delayDinosaur.current = null;
        }else {
          refPosition.current -= dinoSpeed + speed;
          moveDinosaurs(refPosition, id);
        }

      }
    }
  }, delayDinosaur.current);
  useEffect(() => {
    if (!gameOver && !win) takeSoundChoice(idSound, sound);
  }, [sound, gameOver]);

  const idS = useInterval(() => {
    setFrame(frame + 1);
    if (!alive) {
      requestRef.current = spriteXDead[frame];
      setTypeSprite(spriteY[1]);
      if (frame === spriteXDead.length) {
        deleteDinosaurs(id);
        clearInterval(idS);
        return;
      }
    } else {
      if (frame >= spriteX.length) {
        setFrame(0);
      }
      requestRef.current = spriteX[frame];
    }
  }, 70);
  useEffect(() => {
    setFrame(0);
  }, [alive]);
  return (
    <>
      <DinosaurSprite
        zIndex={40}
        exactSpriteConflict={exactSpriteObject}
        className={`dinosaurs ${className}`}
        src={avatar}
        x={x}
        behavior={typeSprite}
        width={alive ? width : widthDead}
        height={height}
        y={y}
        sprite={requestRef.current}
      />

      {!alive && player && player.position && player.position.isDynamiting && (
        <Explosion x={refPosition.current} y={y} />
      )}
    </>
  );
});

export default Dinosaurs;
