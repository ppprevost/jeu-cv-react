import React, { useRef, useState, useEffect } from "react";
import { useInterval, useSpriteException } from "../helpers/hooks";
import { useGameData } from "../store/GameProvider";
import HeroSprite from "./SpriteElement";
import { spriteX } from "../data/player";
import mask from "../img/masque.png";
import mask_right from "../img/mask_right.png";
import styled from "styled-components";

const maskPosition = (direction: 'left' | 'right', position:any, target='left') => {
  let x = {} as any
  if (position.isJumping) {
    x = {
      left: {bottom:80, left:32},
      right: {bottom:75, left:49}
    }
  } else {
    x = {
      left: {bottom: 87, left: 25},
      right: {bottom: 87, left: 40}
    }
  }
  return x[direction][target]
}

const MaskDoctor = styled.img<any>`
  position: absolute;
  bottom: ${({ direction, position }) => (maskPosition(direction, position, 'bottom') + 'px')};
  left: ${({ direction, position }) => (maskPosition(direction, position, 'left') + 'px')};
  z-index: 1000;
`;

interface PropsCharacter {
  width: number;
  height: number;
  x: number;
  y: number;
  position: any;
  exactSpriteObject: {};
  className: string;
  avatar: string;
  behavior: number;
  direction: "left" | "right";
}

const Character = React.memo(
  ({
    width,
    height,
    x,
    y,
    className,
    direction,
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
    const delayRef = useRef<number | null>(50);
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
      if (position.isIdle || position.isJumping) {
        setFrame(0);
        delayRef.current = null;
      }
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
    }, [position, behavior, position.isHurting, position.isJumping]);

    return (
      <>
        <HeroSprite
            id={"mario"}
          exactSpriteConflict={exactSpriteObject}
          className={`${className} ${position.isHurting && "blink_me"}`}
          src={avatar}
          behavior={behavior}
          x={x}
          y={y}
          width={width}
          height={height}
          sprite={position.isIdle? spriteX[0] : sprite}
        >
          {position.isDoctor && (
            <MaskDoctor
              direction={direction}
              position={position}
              src={direction === "left" ? mask : mask_right}
            />
          )}
        </HeroSprite>
      </>
    );
  }
);

export default Character;
