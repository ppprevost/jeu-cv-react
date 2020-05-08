import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import mushroom from "../../img/mushroom.png";
import Sprite from "../../components/SpriteElement";
import {
  useInterval,
  useRadiansMovement,
  useWindowSize
} from "../../helpers/hooks";
import { useGameData } from "../../store/GameProvider";
import { casesConstant, windowSize } from "../../constants/contants";

const Mushroom: FunctionComponent<any> = React.memo(
  ({ x, y, id, type, width, height }) => {
    const { windowSize } = useWindowSize();
    const yRef = useRef(y);
    const [{friend}] = useGameData();
    const xRef = useRef(x);
    const direction = useRef("right");
    const [delay, setDelay] = useState<number | null>(60);
    const [, dispatch] = useGameData();
    const rad = useRadiansMovement(delay);
    useEffect(() => {
      dispatch({
        type: "MOVE_MASK",
        payload: { x: xRef.current, y: yRef.current, id }
      });

      if((friend && xRef.current <=friend.x  && xRef.current + width >= friend.x )){
          dispatch({type:'CURE', payload:{id}})
      }

      if (yRef.current < casesConstant.bottom) {
          if (direction.current === "right") {
              xRef.current = xRef.current += 5;
          }
          if (direction.current === "left") {
              xRef.current = xRef.current -= 5;
          }
        yRef.current = yRef.current - 25;
        if (yRef.current <= 30) {
            yRef.current = 30;

          if (xRef.current+width >= windowSize) {
            direction.current = "left";
          }
          if(xRef.current <= 0 ){
              direction.current = "right"
          }
        }
      } else {
        xRef.current += 5;
        yRef.current = yRef.current + 20 * Math.sin(10 * rad);
      }
    }, [rad, direction.current]);

    return (
      <img
        src={mushroom}
        className={type}
        style={{
          left: xRef.current,
          position: "absolute",
          bottom: yRef.current,
          width: width,
          height: height
        }}
      />
    );
  }
);

export default Mushroom;
