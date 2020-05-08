import React, {FunctionComponent, useEffect, useRef, useState} from "react";
import mask from "../../img/masque.png";
import Sprite from "../../components/SpriteElement";
import {useInterval, useRadiansMovement} from "../../helpers/hooks";
import {useGameData} from "../../store/GameProvider";

const Mask: FunctionComponent<any> = React.memo(({ x, y, id }) => {
  const yRef = useRef(y);
  const xRef = useRef(x);
const [delay,setDelay] = useState<number | null>(60);
const [,dispatch] = useGameData();
const rad = useRadiansMovement(delay)

  useEffect(()=>{
    xRef.current = xRef.current + 10*Math.sin(10*rad)
    yRef.current -= 5;
    dispatch({type:'MOVE_MASK', payload:{x:xRef.current, y:yRef.current, id}})
    if(yRef.current <= 30 ){
      setDelay(null);
    }
  }, [rad])

  return (
    <Sprite
      src={mask}
      className={"test"}
      sprite={0}
      x={xRef.current}
      y={yRef.current}
      width={55}
      height={30}
    />
  );
});

export default Mask;
