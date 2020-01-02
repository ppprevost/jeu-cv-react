import React, { useRef, useState, useEffect } from "react";
import { useInterval, useSpriteException } from "../helpers/hooks";
import { useGameData } from "../store/GameProvider";
import HeroSprite from "./SpriteElement";
import { spriteX } from "../data/player";

interface PropsCharacter {
  width: number;
  height: number;
  x: number;
  y: number;
  exactSpriteObject: {};
  className: string;
  avatar: string;
  behavior: number;
}

const Character = ({
  width,
  height,
  x,
  y,
  className,
  behavior,
  avatar,
  exactSpriteObject
}: PropsCharacter) => {
  const [
    {
      player: { position },
      gameOver
    },
    dispatch
  ] = useGameData();
  const requestRef = useRef(spriteX[0]);
  const delayRef = useRef<number | null>(100);
  const [sprite, setSprite] = useState(spriteX[0]);
  const [frame, setFrame] = useState(0);
  const value = useSpriteException();
  const delayStopHurting = useRef<number | null>(1000);

  useInterval(() => {
    if (position.isHurting) {
      dispatch({ type: "STOP_HURTING" });
    }
  }, delayStopHurting.current);

  useInterval(() => {
    setFrame(frame + 1);
    if (frame >= value) {
      if (position.isHurting) {
        if (gameOver) {
          delayRef.current = null;
        }
      }
      setFrame(0);
    }
    requestRef.current = spriteX[frame];
    setSprite(requestRef.current);
  }, delayRef.current);

  useEffect(() => {
    setFrame(0);
  }, [position, behavior, position.isHurting]);
  useEffect(() => {
    delayRef.current = null;
    setFrame(0);
    if (position.isDynamiting && position.isCrouching) {
      setFrame(0);
      delayRef.current = 400;
    } else if (position.isDynamiting) {
      setFrame(0);
      delayRef.current = 200;
    } else {
      delayRef.current = 100;
    }
  }, [position.isDynamiting, position.isCrouching]);

  return (
    <HeroSprite
      exactSpriteConflict={exactSpriteObject}
      className={`${className} ${position.isHurting && "blink_me"}`}
      src={avatar}
      behavior={behavior}
      x={x}
      y={y}
      width={width}
      height={height}
      sprite={sprite}
    />
  );
};

export default Character;