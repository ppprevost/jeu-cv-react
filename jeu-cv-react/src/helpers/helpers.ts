import {useEffect, useRef, useState,} from "react";
import {useGameData} from "../store/GameProvider";
import {MOVE_LEFT} from "../constants";

export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<any>(null);
    const saveCancelRef = useRef<any>(null)
    const [interval, setClearInterval] = useState(saveCancelRef);
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current()
        }
        if (delay !== null) {
            saveCancelRef.current = setInterval(tick, delay);
            setClearInterval(saveCancelRef.current)
            return () => clearInterval(saveCancelRef.current);
        }
    }, [delay]);
    return interval
}

export const useChrono = () => {
    const [{gameOver}, dispatch] = useGameData();
    const id = useInterval(() => {
        if (gameOver) {
            return clearInterval(id)
        }
        dispatch({type: 'ADD_TIME'})
    }, 1000)
}

export const useConflict = () => {
    const [{player, dino, gameOver}, dispatch] = useGameData();
    const id = useInterval(() => {
        if (gameOver) {
            clearInterval(id)
        }
        if (dino.length && player) {
            for (let i = 0; i < dino.length; i++) {
                if (dino[i].alive && player.x + player.width >= dino[i].x
                    && player.x + player.width <= dino[i].x + dino[i].width
                    && player.y + player.height >= dino[i].y
                    && player.y + player.height <= dino[i].y + dino[i].height) {
                    dispatch({type: 'COLLISION'})
                }
            }
        }
    }, 300)
}

export const useSpriteException = () => {
    const [{player: {position}}] = useGameData()
    const [value, setValue] = useState(10)
    useEffect(() => {
        if (position.isRunning || position.isRunningLeft) {
            setValue(7)
        } else setValue(9)
    }, [position])
    return value
}

const RIGHT = 39;
const UP = 38;
const BOTTOM = 40;
const LEFT = 37;
const SPACE = 32;

export function useKeyPress() {
    const [{player: {position}, gameOver}, dispatch] = useGameData();
    // State for keeping track of whether key is pressed
    const [keyPressed] = useState(false);
    // If pressed key is our target key then set to true
    const downHandler = ({keyCode}: KeyboardEvent) => {
        switch (keyCode) {
            case UP :
                if (!position.isJumping) {
                    dispatch({type: 'JUMP'})
                }
                break;
            case RIGHT:
                if (!position.isRunning && !position.isHurting) {
                    dispatch({type: 'MOVE_RIGHT'})
                }
                break;
            case BOTTOM:
                if (!position.isCrouching && !position.isHurting) {
                    dispatch({type: 'IS_CROUCHING'})
                }
                break;
            case LEFT:
                if (!position.isRunningLeft && !position.isHurting) {
                    dispatch({type: MOVE_LEFT})
                }
                break;
            case SPACE :
                if (!position.isWalkingShoot) {
                    dispatch({type: 'SHOOT'})
                }

        }
    }
    // If released key is our target key then set to false
    const upHandler = ({keyCode}: KeyboardEvent) => {
        switch (keyCode) {
            case UP:
                if (position.isJumping) {
                    dispatch({type: 'LAND_PLAYER'})
                }
            case RIGHT:
                if (position.isRunning) {
                    dispatch({type: 'IDLE'})
                }
                break;
            case LEFT:
                if (position.isRunningLeft) {
                    dispatch({type: 'IDLE'})
                }
                break;
            case BOTTOM:
                if (position.isCrouching) {
                    dispatch({type: 'IDLE'})
                }
                break;
        }
    };

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        if (gameOver) {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        }
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, [position, gameOver]); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
}



