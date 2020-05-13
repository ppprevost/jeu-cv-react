import React, {CSSProperties, useEffect, useRef, useState} from "react";
import { dinoSpeed, intervalSpeedDino } from "../constants/contants";
import { useInterval } from "../helpers/hooks";
import { useGameData } from "../store/GameProvider";
import Explosion from "./Explosion";
import styled, { keyframes } from "styled-components";
import { conditionToConflict } from "../helpers/ennemies_helpers";
import useActionDinosaurs from "../actions/dinosaurs-actions";
import { AliveElement } from "../reducers/global_reducer";


const style = (x:number, y:number, width:number, height:number):CSSProperties=>({
position: 'absolute',
zIndex: 40,
left: x + 'px',
bottom: y + 'px',
width: width + 'px',
height: height + 'px'});


export interface IPropsDino extends AliveElement {
  id: number;
  speed: number;
  avatar: string;
  className: string;
  spriteXDead?: number[];
  health?: number;
  spriteX?: number[];
  exactSpriteObject?: any;
  spriteY?: number[];
  widthDead?: number;
  idSound?: string;
  alive?: boolean;
}

const Virus = React.memo(
  ({
    id,
    x,
    y,
    width,
    height,
    avatar,
    direction: directionVirus,
    className,
    speed,
    alive,
    exactSpriteObject
  }: IPropsDino) => {
    const [
      {
        player,
        friend,
        direction,
        windowInfo: { windowSize }
      }
    ] = useGameData();
    const refPosition = useRef(x);
    const positionInitial = useRef(0);
    const delayDinosaur = useRef<number | null>(intervalSpeedDino);
    const {
      deleteDinosaurs,
      collision,
      moveDinosaurs,
      makeFriendSick
    } = useActionDinosaurs();
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
          positionHero,
          refPosition,
          exactSpriteObject ? exactSpriteObject.width : width,
          player.y,
          y,
          height
        )
      ) {
        collision(id);
      }
      if (
        friend &&
        conditionToConflict(
          friend.x,
          refPosition,
          friend.width/2,
          friend.y,
          y,
          height
        )
      ) {
        if (!friend.isSick) {
          makeFriendSick(friend.id);
        }
      }
      if (directionVirus === "right") {
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
          refPosition.current -= dinoSpeed + speed;
          moveDinosaurs(refPosition, id);
        }
      }
    }, delayDinosaur.current);
    return (
      <>
        <img
          src={avatar}
          style={style(x,y,width,height)}
          alt="virus"
          className={`${className}`}
        />
      </>
    );
  }
);

export default Virus;
