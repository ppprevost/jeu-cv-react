import React, { useState, useEffect, useRef } from "react";
import peach from "../img/princess.png";
import peachRight from "../img/princess_right.png";
import SpriteContainer from "./SpriteElement";
import { windowSize } from "../constants/contants";
import { useInterval } from "../helpers/hooks";
import { Friend } from "../reducers/global_reducer";
import { useGameData } from "../store/GameProvider";
import { wait } from "../helpers/main_helpers";
import couch from "../sound/mario-cough.wav";

export const spriteX = [0, -115, -231];
export const spriteY = [0, -186, -298];

const couchAudio = new Audio(couch);


export function repeatPlay(
  audio: HTMLAudioElement,
  times: number,
  ended?: () => {}
) {
  if (times <= 0) {
    return;
  }

  let played = 0;
  audio.addEventListener("ended", async function x() {
    played++;
    if (played < times) {
      return audio.play();
    }
    await wait(3000)
    played = 0
    audio.play()
  });

  audio.play();
}

const useFriendMovement = (
  init = windowSize / 2,
  x: number,
  delay: number | null,
  isSick = false,
  amplitude = 5,
  leftMax = 0.3,
  rightMax = 0.3,
) => {
  const maxLeftPixel = init - init * leftMax;
  const maxRightPixel = init + init * rightMax;
  const direction = useRef("left");
  const actualPositionRef = useRef(622)
  const delayRef = useRef<number | null>(delay);
  const [{win, player:{x:playerX}}] = useGameData()
  useInterval(async () => {
    if (isSick) {
      repeatPlay(couchAudio, 3);
      return (delayRef.current = null);
    }
    if(actualPositionRef.current) {
      if (direction.current === "left") {
        actualPositionRef.current = x - amplitude;
      }
      if (direction.current === "right") {
        actualPositionRef.current = x + amplitude;
      }

        if (actualPositionRef.current === init) {
          delayRef.current = null;
          await wait(2000);
          delayRef.current = delay;
          direction.current = "left";
        }
        if (actualPositionRef.current <= maxLeftPixel) {
          delayRef.current = null;
          await wait(2000);
          delayRef.current = delay;
          direction.current = "right";
        }
        if (actualPositionRef.current >= maxRightPixel) {
          delayRef.current = null;
          await wait(2000);
          delayRef.current = delay;
          direction.current = "left";
        }

    }
  }, delayRef.current);
  return [actualPositionRef.current, direction.current];
};

const FriendComponent = ({ id, x, y, width, height, isSick }: Friend) => {
  const [sprite, setSprite] = useState(spriteX[0]);
  const [behavior, setSpriteY] = useState(spriteY[0]);
  const [frame, setFrame] = useState(0);
  const [{win}, dispatch] = useGameData();
  const [delay] = useState(400);
  const init = useRef<number | null>(null);
  const [move, direction] = useFriendMovement(
    init.current as number,
    x,
    200,
    isSick
  );

  useEffect(() => {
    init.current = x;
  }, [init.current]);

  useEffect(() => {
    if(!isSick) dispatch({ type: "MOVE_FRIEND", payload: { x: move } });
  }, [move, isSick]);

  useInterval(async () => {
    setFrame(frame + 1);
    if (frame >= 3) {
      setFrame(0);
    }
    setSprite(spriteX[frame]);
  }, delay);

  return (
    <SpriteContainer
      src={direction === "left" ? peach : peachRight}
      width={width}
      height={height}
      y={y}
      x={x}
      className={`friends ${isSick && "blink_me_infinite"}`}
      behavior={win ? spriteY[1] : behavior}
      sprite={sprite}
    />
  );
};

export default FriendComponent;
