import { useEffect, useRef, useState } from "react";
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

export function useFetch<T>(
  url: string,
  options: any = {}
): { response: T | null; error: Error | null; isLoading: boolean } {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const asyncFetch = async () => {
      setIsLoading(true);
      try {
        const fetched = await fetch(url, options);
        console.log(fetched);
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
    asyncFetch();
  }, []);
  console.log(response, error);
  return { response, error, isLoading };
}

export function useInterval(callback: () => void, delay: number | null) {
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
    if (delay !== null && !win && !pause && !gameOver) {
      saveCancelRef.current = setInterval(tick, delay);
      setClearInterval(saveCancelRef.current);
      return () => clearInterval(saveCancelRef.current);
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
      setValue(7);
    } else if (position.isCrouching && position.isShooting) {
      console.log(position.isCrouching, position.isShooting);
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
  const { windowSize } = useWindowSize();
  const delayRef = useRef(0);
  let [size, interval] = [800, 1900];
  const diff = size - windowSize;
  interval += diff * 1.5;
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
  const [windowWidth, setWidth] = useState(window.innerWidth);
  const [windowHeight, setHeight] = useState(window.innerHeight);
  const [landscape, setLandscape] = useState(
    window.matchMedia("(orientation: landscape)").matches
  );
  useEffect(() => {
    dispatch({
      type: "SET_WINDOW",
      ...{
        windowSize: windowWidth,
        windowHeight,
        isMobile: isMobile(),
        landscape
      }
    });
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      setLandscape(window.matchMedia("(orientation: landscape)").matches);
      console.log(isMobile())
      dispatch({
        type: "SET_WINDOW",
        ...{
          windowSize: windowWidth,
          windowHeight,
          isMobile: isMobile(),
          landscape
        }
      });
    });
  }, []);
  return {
    windowSize: windowWidth,
    windowHeight,
    landscape,
    isMobile: isMobile()
  };
};

export function useKeyPress() {
  const [
    {
      player: { position },
      gameOver
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
      case BOTTOM:
        if (!position.isCrouching) {
          dispatch({ type: "IS_CROUCHING" });
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
      case DYNAMITE:
        if (!position.isDynamiting && !position.isHurting) {
          dispatch({ type: "IS_DYNAMITING" });
        }
    }
  };
  // If released key is our target key then set to false
  const upHandler = ({ keyCode }: KeyboardEvent) => {
    switch (keyCode) {
      case UP:
        if (position.isJumping) {
          dispatch({ type: "LAND_PLAYER" });
        }
        break;
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
      case BOTTOM:
        if (position.isCrouching) {
          dispatch({ type: "IS_CROUCHING", stop: true });
        }
        break;
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    if (gameOver) {
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

// from https://www.jayfreestone.com/writing/react-portals-with-hooks/
/**
 * Creates DOM element to be used as React root.
 * @returns {HTMLElement}
 */
function createRootElement(id: string) {
  const rootContainer = document.createElement("div");
  rootContainer.setAttribute("id", id);
  return rootContainer;
}

/**
 * Appends element as last child of body.
 * @param {HTMLElement} rootElem
 */
function addRootElement(rootElem: Node) {
  document.body.insertBefore(
    rootElem,
    document.body &&
      document.body.lastElementChild &&
      document.body.lastElementChild.nextElementSibling
  );
}

/**
 * Hook to create a React Portal.
 * Automatically handles creating and tearing-down the root elements (no SRR
 * makes this trivial), so there is no need to ensure the parent target already
 * exists.
 * @example
 * const target = usePortal(id, [id]);
 * return createPortal(children, target);
 * @param {String} id The id of the target container, e.g 'modal' or 'spotlight'
 * @returns {HTMLElement} The DOM node to use as the Portal target.
 */
export function usePortal(id: string) {
  const rootElemRef = useRef<any>(null);
  useEffect(function() {
    // Look for existing target dom element to append to
    const existingParent = document.querySelector(`#${id}`);
    // Parent is either a new root or the existing dom element
    const parentElem = existingParent || createRootElement(id);
    // If there is no existing DOM element, add a new one.
    if (!existingParent) {
      addRootElement(parentElem);
    }
    // Add the detached element to the parent
    while (parentElem.firstChild) {
      parentElem.firstChild.remove();
    }
    parentElem.appendChild(rootElemRef.current);
    return () => {
      rootElemRef.current.remove();
      if (parentElem.childNodes.length === -1) {
        parentElem.remove();
      }
    };
  }, []);

  /**
   * It's important we evaluate this lazily:
   * - We need first render to contain the DOM element, so it shouldn't happen
   *   in useEffect. We would normally put this in the constructor().
   * - We can't do 'const rootElemRef = useRef(document.createElement('div))',
   *   since this will run every single render (that's a lot).
   * - We want the ref to consistently point to the same DOM element and only
   *   ever run once.
   * @link https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
   */
  function getRootElem() {
    if (!rootElemRef.current) {
      rootElemRef.current = document.createElement("div");
    }
    return rootElemRef.current;
  }

  return getRootElem();
}

export default usePortal;
