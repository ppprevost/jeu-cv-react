import { useGameData } from "../store/GameProvider";
import React, { useEffect, useRef, useState } from "react";
import boxImg from "../img/box.png";
import SpriteBox from "../components/SpriteElement";
import { useInterval } from "../helpers/hooks";
import usedBox from "../img/box_usado.png";

export interface BoxProps {
  width: number;
  left: number;
  type: string;
  bottom: number;
  hit: boolean;
  height: number;
}

const sprite = [0, -63];

const BonusCase = ({ width, height, bottom, left, hit, type }: BoxProps) => {
  const [, dispatch] = useGameData();
  const refY = useRef(bottom);
  const imgRef = useRef(boxImg);
  const isHit = useRef(false)
  const [frame, setFrame] = useState(0);
  const [actualSprite, setSprite] = useState(sprite[0]);
  const delayRef = useRef<null | number>(null)
  useEffect(() => {
    if (hit) {
      setTimeout(
        () => dispatch({ type: "REINIT_CASE", payload: { type } }),
        6000
      );
    }
  }, [hit]);

  useEffect(()=>{
    if (hit) {
      delayRef.current = null
      isHit.current = true;
      if(isHit.current){
        refY.current += 30;
        setTimeout(()=>{
          refY.current -= 30;
          isHit.current = false;

        }, 100)
      }
    }
    if(!hit){
      delayRef.current = 400
    }
  }, [hit])

  useInterval(() => {
    setSprite(sprite[frame]);
    setFrame(frame + 1);
    if (frame >= sprite.length) {
      setFrame(0);
    }
  }, delayRef.current);
  return (
    <SpriteBox
      width={width}
      height={height}
      className={"box"}
      src={hit? usedBox : imgRef.current}
      sprite={hit? sprite[0] : actualSprite }
      y={refY.current}
      x={left}
    />
  );
};

export default BonusCase;
