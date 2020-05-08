import React, { useEffect, useState, useRef } from "react";
import bulletImg from "../img/item.png";
import { useInterval } from "../helpers/hooks";
import { useGameData } from "../store/GameProvider";
import { intervalBullet, speedBullet } from "../constants/contants";
import BulletSprite from "./SpriteElement";
import {useBulletActions} from "../actions/bullet-actions";

export interface IBulletProps {
  id: number;
  type: string;
  width: number;
  height: number;
  spriteItemX: number[];
  spriteItemY: number;
  className: string;
}

const BulletComponent = ({
  type,
  id,
  width,
  height,
  spriteItemX,
  spriteItemY,
  className
}: IBulletProps) => {
  const [
    {
      player,
      dino,
      direction,
      windowInfo: { windowSize }
    }
  ] = useGameData();
  const {stopBullet, killDino, rampage} = useBulletActions()
  const ref = useRef(player.x + 100);
  const refDirection = useRef<string | null>(null);
  const y = useRef(player.position.isCrouching ? player.y + 25 : player.y + 45);
  const [x, setX] = useState(player.x + 100);
  const [sprite, setSprite] = useState(spriteItemX[0]);
  const [frame, setFrame] = useState(0);
  const avatar = bulletImg;
  const refDelayBullet = useRef<number | null>(intervalBullet);

  useEffect(() => {
    refDirection.current = direction;
  }, []);
  useInterval(() => {
    setFrame(frame + 1);
    setSprite(spriteItemX[frame]);
    if (frame === spriteItemX.length) {
      setFrame(0);
    }
    if (refDirection.current === "right") {
      ref.current = x + speedBullet;
    } else {
      ref.current = x - speedBullet;
    }
    setX(ref.current);
    if (x >= windowSize * 1.5 || x < -windowSize / 2) {
      refDelayBullet.current = null;
      stopBullet(type, id)
    }
    const directionBullet = direction === "left" ? x : x + width;
    for (var i = 0; i < dino.length; i++) {
      if (dino[i].alive) {
        if (
          directionBullet >= dino[i].x &&
          directionBullet <= dino[i].x + dino[i].width &&
          y.current + height >= dino[i].y &&
          y.current + height <= dino[i].y + dino[i].height
        ) {
          if (type === "bullet") {
            if (dino[i].className !== "spike" && dino[i].className !== "vine") {

              stopBullet(type,id)
              refDelayBullet.current = null;
              killDino(dino[i])
            } else {
              continue;
            }
          } else {
            rampage()
          }
        }
      }
    }
  }, refDelayBullet.current);

  return (
    <BulletSprite
      className={className}
      width={width}
      height={height}
      y={y.current}
      x={refDirection.current === "right" ? x : x - player.width}
      src={avatar}
      behavior={spriteItemY}
      sprite={sprite}
    />
  );
};

export default BulletComponent;
