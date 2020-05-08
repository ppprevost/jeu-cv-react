import React, { useState, useRef, useEffect } from "react";
import SpriteElement from "./SpriteElement";
import { useInterval } from "../helpers/hooks";
import { useGameData } from "../store/GameProvider";
import { AliveElement } from "../reducers/global_reducer";
import { createEnemy } from "../helpers/ennemies_helpers";
import { wait } from "../helpers/main_helpers";
import useActionDinosaurs from "../actions/dinosaurs-actions";

const spriteX = [0, -86, -173];

export interface AnyElement {
  id: string | number;
  x: number;
  y: number;
  width: number;
  height: number;
  direction?: Direction;
  avatar: string;
  className?: string;
}

export type Direction = "left" | "right";

const Pangolin = ({
  x,
  y,
  width,
  height,
  avatar,
  className,
  hurt = false,
  id,
  direction
}: AliveElement) => {
  const { addEnemy } = useActionDinosaurs();
  const [sprite, setSprite] = useState(spriteX[0]);
  const [frame, setFrame] = useState(0);
  const [
    {
      windowInfo: { windowSize }
    },
    dispatch
  ] = useGameData();
  const delay = 100;
  const delayRef = useRef<number | null>(delay);
  const virus = createEnemy(windowSize, "virus", {
    direction: direction as Direction,
    x
  });

  useEffect(() => {
    if (hurt) {
      console.log("hurt: ", hurt);
      delayRef.current = delay;
    }
  }, [hurt]);

  useInterval(() => {
    setFrame(frame + 1);
    setSprite(spriteX[frame]);
    if (frame >= spriteX.length) {
      setFrame(0);
    }
    if (direction === "right") {
      console.log(hurt, "hurted");
      if (hurt) {
        dispatch({
          type: "ANIMATE_PANGOLIN",
          payload: { x: x - 10, direction }
        });
        if(x < -width){
            dispatch({type:'DELETE_PANGOLIN', payload:{direction}})
        }
      } else {
        if (windowSize * 0.05 <= x) {
          setSprite(1);
          delayRef.current = null;
        }
        dispatch({
          type: "ANIMATE_PANGOLIN",
          payload: { x: x + 10, direction }
        });
      }
    }
    if (direction === "left") {
      if (hurt) {
          if(x>windowSize ){
              dispatch({type:'DELETE_PANGOLIN', payload:{direction}})
          }
        dispatch({
          type: "ANIMATE_PANGOLIN",
          payload: { x: x + 10, direction }
        });
      } else {
        if (windowSize * 0.9 >= x) {
          delayRef.current = null;
          setSprite(1);
        }
        dispatch({
          type: "ANIMATE_PANGOLIN",
          payload: { x: x - 10, direction }
        });
      }
    }
  }, delayRef.current);

  useInterval(async () => {
    if (!delayRef.current) {
      await wait(2000);
      addEnemy(virus);
    }
  }, 4000);

  return (
    <SpriteElement
      sprite={sprite}
      src={avatar}
      className={className || "pangolin"}
      width={width}
      height={height}
      x={x}
      y={y}
    ></SpriteElement>
  );
};

export default Pangolin;
