import {useCallback, useEffect, useRef, useState} from "react";
import { useGameData } from "../store/GameProvider";
import { MOVE_LEFT, MOVE_RIGHT } from "../constants";
import {
  RIGHT,
  LEFT,
  BOTTOM,
  DYNAMITE,
  UP,
  SPACE,
  PAUSE
} from "../constants/contants";

interface Options {
  method: string;
  body: string;
  headers: any;
}

export function useFetch<T>(
  url: string,
  options = {} as Options,
  start = true
): { response: T | null; error: Error | null; isLoading: boolean } {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const asyncFetch = async () => {
      setIsLoading(true);
      try {
        const fetched = await fetch(url, options);
        if (fetched.status >= 400) {
          throw new Error(await fetched.text());
        }
        const responsed = await fetched.json();
        setResponse(responsed);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        if (e.message) {
          return setError(e.message);
        }
        return setError(e);
      }
    };
    if (start) {
      asyncFetch();
    }
  }, [start]);
  return { response, error, isLoading };
}

export function useInterval(callback: () => void, delay: number | null,condition = true) {
  const [{ win, pause, gameOver }] = useGameData();
  const savedCallback: any = useRef(null);
  const saveCancelRef: any = useRef(0);
  const [interval, setClearInterval] = useState(saveCancelRef);
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null && !win && !pause && !gameOver && condition) {
      saveCancelRef.current = setInterval(tick, delay);
      setClearInterval(saveCancelRef.current);
      return () => { return clearInterval(saveCancelRef.current)};
    }
  }, [delay, win, pause, gameOver]);
  return interval;
}

export const useChrono = () => {
  const [{ gameOver }, dispatch] = useGameData();
  const id = useInterval(() => {
    if (gameOver) {
      return clearInterval(id);
    }
    dispatch({ type: "ADD_TIME" });
  }, 1000);
};

export const useSpriteException = () => {
  const [
    {
      player: { position }
    }
  ] = useGameData();
  const [value, setValue] = useState(10);
  useEffect(() => {
    if (position.isRunning || position.isRunningLeft) {
      setValue(6);

    }
    else if(position.isJumping){setValue(2)}
    else if (position.isCrouching && position.isShooting) {
      setValue(4);
    } else if (position.isDynamiting) {
      if (position.isCrouching) {
        setValue(2);
      } else {
        setValue(7);
      }
    } else setValue(9);
  }, [position]);
  return value;
};

function isMobile() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}

export const useCalculateIntervalDino = () => {
  const [{ player }] = useGameData();
  const { windowSize, isMobile } = useWindowSize();
  const delayRef = useRef(0);
  let [size, interval] = [800, 2300];
  const diff = size - windowSize;
  if(isMobile && size < windowSize){
    interval += diff * 1.2
  } else {
  interval += diff * 1.5;
  }
  useEffect(() => {
    delayRef.current = interval;
  }, [windowSize, interval]);
  useEffect(() => {
    if (player) {
      delayRef.current -= 10;
    }
  }, [player && player.score]);
  return Math.round(delayRef.current);
};

export const useWindowSize = () => {
  const [, dispatch] = useGameData();
  const [windowHeight, setHeight] = useState(window.innerHeight);
  const [landscape, setLandscape] = useState(
    window.matchMedia("(orientation: landscape)").matches
  );
  useEffect(() => {
    dispatch({
      type: "SET_WINDOW",
      ...{
        windowSize: window.innerWidth,
        windowHeight,
        isMobile: isMobile(),
        landscape
      }
    });
    window.addEventListener("resize", () => {
      setHeight(window.innerHeight);
      setLandscape(window.matchMedia("(orientation: landscape)").matches);
      dispatch({
        type: "SET_WINDOW",
        ...{
          windowSize: window.innerWidth,
          windowHeight,
          isMobile: isMobile(),
          landscape
        }
      });
    });
  }, []);
  return {
    windowSize: window.innerWidth,
    windowHeight,
    landscape,
    isMobile: isMobile()
  };
};


export function useKeyPress() {
  const [
    {
      player: { position },
      gameOver,
      win
    },
    dispatch
  ] = useGameData();
  // State for keeping track of whether key is pressed
    const [keyPressed] = useState(false);
    // If pressed key is our target key then set to true
    const downHandler = ({ keyCode }: KeyboardEvent) => {
      switch (keyCode) {
        case UP:
          if (
              !position.isJumping &&
              !position.isHurting &&
              !position.isDynamiting
          ) {
            dispatch({ type: "JUMP" });
          }
          break;
        case RIGHT:
          if (!position.isRunning) {
            dispatch({ type: MOVE_RIGHT });
          }
          break;
        case LEFT:
          if (!position.isRunningLeft) {
            dispatch({ type: MOVE_LEFT });
          }
          break;
        case SPACE:
          if (!position.isShooting && !position.isHurting) {
            dispatch({ type: "SHOOT" });
          }
          break;
        case PAUSE:
          dispatch({ type: "SET_PAUSE" });
          break;
      }
    };
    // If released key is our target key then set to false
    const upHandler = ({ keyCode }: KeyboardEvent) => {
      switch (keyCode) {

        case RIGHT:
          if (position.isRunning) {
            dispatch({ type: "MOVE_RIGHT", stop: true });
          }
          break;
        case LEFT:
          if (position.isRunningLeft) {
            dispatch({ type: MOVE_LEFT, stop: true });
          }
          break;
      }
    };

    // Add event listeners
    useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      if (gameOver || win) {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      }
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    }, [position, gameOver, downHandler, upHandler]); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;



}

export const useRadiansMovement = (delay:any)=> {
  function radians(deg:number) {return deg*Math.PI/180;};
  const [rad, setRad] = useState(0);
  const mathConst = 2 * Math.PI;
  const [degree, setDegree] = useState(45)
  useInterval(()=> {
    setDegree(degree+1)
    if (rad >= mathConst) {
      setRad(0);
      setDegree(0);
    }
    if (rad < mathConst) {
      setRad(radians(degree));
    }
  }, delay)
  return rad
}

