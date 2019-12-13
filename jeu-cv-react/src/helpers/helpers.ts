import {useEffect, useRef, useState, useCallback, useLayoutEffect} from "react";
import {useGameData} from "../store/GameProvider";
import {MOVE_LEFT} from "../constants";

const spriteException = () => {
    const [data] = useGameData()
    const [value, setValue] = useState(10)
    useEffect(() => {
        console.log(value)
        if (data.player.position.isRunning) {
            setValue(8)
        } else setValue(10)
        console.log('set to ', value)
    }, [data])

    return value
}

export const useAnimation = (tempo: number, spriteX: number[]) => {
    const requestRef = useRef(spriteX[0]);
    const [sprite, setSprite] = useState(spriteX[0]);
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
                if (frame === spriteX.length) {
                    frame = 0;
                }
                requestRef.current = spriteX[frame]
                setSprite(requestRef.current);
                tPrecedent = tActuel;
            }
            requestAnimationFrame(spriteAnimation);
        };
        spriteAnimation(tempo)
    }
    useEffect(() => {
        animateRequestFrame(tempo)
    }, [])

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
                if(position.isRunning){
                    refPosition.current += 10
                }else {
                refPosition.current -= 10
                }
                setPositionX(refPosition.current)
                dispatch({type: 'ANIMATE_PLAYER', x: refPosition.current})
                tPrecedent = tActuel;
            }
            console.log('position.isRunning: ', position.isRunning);
            if (position.isRunning || position.isRunningLeft){
                refCancel.current = requestAnimationFrame(moving);
            }
            else {
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

export function useKeyPress() {
    const [{player: {position}}, dispatch] = useGameData();
    // State for keeping track of whether key is pressed
    const [keyPressed] = useState(false);
    // If pressed key is our target key then set to true
    const downHandler = ({keyCode}: KeyboardEvent) => {
        switch (keyCode) {
            case RIGHT:
                if (!position.isRunning) {
                    dispatch({type: 'MOVE_RIGHT'})
                }
                break;
            case BOTTOM:
                if (!position.isCrouching) {
                    dispatch({type: 'IS_CROUCHING'})
                }
                break;
            case LEFT:
                if (!position.isRunningLeft) {
                    dispatch({type: MOVE_LEFT})
                }
        }
    }

    // If released key is our target key then set to false
    const upHandler = ({keyCode}: KeyboardEvent) => {
        switch (keyCode) {
            case RIGHT:
                if (position.isRunning) {
                    console.log('isIdle nowjdskjfdjlhfjkdshfsd !!', position.isRunning);
                    dispatch({type: 'IDLE'})
                }
            case LEFT:
                if (position.isRunningLeft) {
                    dispatch({type: 'IDLE'})
                }
            case BOTTOM:
                if (position.isCrouching) {
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
    }, [position]); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
}

