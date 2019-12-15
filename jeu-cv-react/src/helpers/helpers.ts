import {useEffect, useRef, useState, useLayoutEffect,} from "react";
import {useGameData} from "../store/GameProvider";
import {MOVE_LEFT} from "../constants";

export function useInterval(callback: () => void, delay: number) {
    const savedCallback: any = useRef(null);
    const saveCancelRef: any = useRef(null)
    const [interval, setClearInterval] = useState(saveCancelRef)
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
                saveCancelRef.current = setInterval(tick, delay);
                setClearInterval(saveCancelRef.current)
            return () => clearInterval(saveCancelRef.current);
        }
    }, [delay]);
    return interval
}

let animateRequestFrame = (tempo: number, callback: any) => {
    let tActuel;
    let tPrecedent: number;
    let spriteAnimation = function (actuel: number) {
        tActuel = actuel;
        tPrecedent = tPrecedent || actuel;
        let delai = tActuel - tPrecedent;
        if (delai > tempo) {
            callback()
            tPrecedent = tActuel;
        }
        return requestAnimationFrame(spriteAnimation);

    };
    return spriteAnimation(tempo)
}

export const useRequestAnimationFrame = (callback: () => void, delay: number, watcher?: any[]) => {
    const savedCallback: any = useRef(null)
    const saveCancelRef: any = useRef(null)
    const watch: any[] = []
    if (watcher) {
        watch.concat(watch, watcher)
    }
    const [interval, setClearAnimationFrame] = useState(0)
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            saveCancelRef.current = animateRequestFrame(delay, tick);
            setClearAnimationFrame(saveCancelRef.current)
        }
        //cancelAnimationFrame(saveCancelRef.current)
        return () => cancelAnimationFrame(interval)
    }, [delay])
    return saveCancelRef.current
}


export const useChrono = () => {
    const [second, setSecond] = useState(0)
    const [minute, setMinute] = useState(0)
    useInterval(() => {
        setSecond(second + 1)
        if (second === 59) {
            setSecond(0);
            setMinute(minute + 1);
        }
    }, 1000)

    return {second, minute}
}

export const useConflict = () => {
    const [{player, dino}, dispatch] = useGameData();
    useInterval(() => {
        if (dino.length && player) {
            for (let i = 0; i < dino.length; i++) {
                //console.log(player.x + player.width, dino[i].x)
                if (player.x + player.width >= dino[i].x
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
            console.log('true running')
            setValue(7)
        } else setValue(9)
    }, [position])

    return value
}

/**
 * use for hero and dinosaur sprite
 * @param tempo
 * @param spriteX
 */
export const useAnimation = (tempo: number, spriteX: number[]) => {
    const requestRef = useRef(spriteX[0]);
    const [sprite, setSprite] = useState(spriteX[0]);
    const [{player: {position}, gameOver}, dispatch] = useGameData()
    const value = useSpriteException()
    const [valueLength, setvalueLenght] = useState(value)
    const requestref = useRef(value)
    let animateRequestFrame = (tempo: number) => {
        let tActuel;
        let tPrecedent: number;
        let frame = 0;
        let spriteAnimation = function (actuel: number) {
            tActuel = actuel;
            tPrecedent = tPrecedent || actuel;
            let delai = tActuel - tPrecedent;
            if (delai > tempo) {
                frame++;
                if (frame === valueLength && position.isHurting) {
                    cancelAnimationFrame(requestRef.current)
                    return dispatch({type: 'STOP_HURTING'})
                }
                if (frame === valueLength) {
                    frame = 0;
                }
                requestRef.current = spriteX[frame]
                setSprite(requestRef.current);
                tPrecedent = tActuel;
            }
            requestref.current = requestAnimationFrame(spriteAnimation);
        };
        spriteAnimation(tempo)
    }
    useEffect(() => {
        setvalueLenght(value)
        console.log(position.isRunning, position.isRunningLeft, valueLength)
        if (!gameOver) animateRequestFrame(tempo)
        return () => {
            cancelAnimationFrame(requestref.current)
        }
    }, [position, gameOver])

    return {sprite}
}


export const useMoving = (tempo: number) => {
    const [{player: {x, position}}, dispatch] = useGameData();
    const refPosition = useRef(x)
    const [positionX, setPositionX] = useState(x);
    const refCancel = useRef(0)
    let animateRequestFrame = (tempo: number) => {
        let tActuel;
        let tPrecedent: number;
        let moving = function (actuel: number) {
            tActuel = actuel;
            tPrecedent = tPrecedent || actuel;
            let delai = tActuel - tPrecedent;
            if (delai > tempo) {
                if (position.isRunning) {
                    refPosition.current += 10
                } else {
                    refPosition.current -= 10
                }
                setPositionX(refPosition.current)
                dispatch({type: 'ANIMATE_PLAYER', x: refPosition.current})
                tPrecedent = tActuel;
            }
            if (position.isRunning || position.isRunningLeft) {
                console.log('isRunningAnimate !!')
                refCancel.current = requestAnimationFrame(moving);
            } else {
                return;
            }

        };
        moving(tempo)
    }
    useLayoutEffect(() => {
        animateRequestFrame(tempo)
        return () => cancelAnimationFrame(refCancel.current)
    }, [position])
    return positionX
}

const RIGHT = 39;
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
            case RIGHT:
                if (!position.isRunning && !gameOver && !position.isHurting) {
                    dispatch({type: 'MOVE_RIGHT'})
                }
                break;
            case BOTTOM:
                if (!position.isCrouching && !gameOver && !position.isHurting) {
                    dispatch({type: 'IS_CROUCHING'})
                }
                break;
            case LEFT:
                if (!position.isRunningLeft && !gameOver && !position.isHurting) {
                    dispatch({type: MOVE_LEFT})
                }
                break;
            case SPACE :
                if (!gameOver && !position.isWalkingShoot) {
                    dispatch({type: 'SHOOT'})
                }
        }
    }
    // If released key is our target key then set to false
    const upHandler = ({keyCode}: KeyboardEvent) => {
        switch (keyCode) {
            case RIGHT:
                if (position.isRunning && !gameOver) {
                    dispatch({type: 'IDLE'})
                }
                break;
            case LEFT:
                if (position.isRunningLeft && !gameOver) {
                    dispatch({type: 'IDLE'})
                }
                break;
            case BOTTOM:
                if (position.isCrouching && !gameOver) {
                    dispatch({type: 'IDLE'})
                }
                break;
            case SPACE:
                if (position.isWalkingShoot && !gameOver) {
                    dispatch({type: 'IDLE'})
                }
        }
    };

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, [position, gameOver]); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
}

