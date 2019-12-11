import {useEffect, useRef, useState} from "react";

export const useAnimation = (tempo:number, spriteX:number[], spriteY?:number)=> {
    const requestRef = useRef(spriteX[0]);
    const [sprite, setSprite] = useState(spriteX[0])
    const [mood, setMood] = useState(spriteY)
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
                if (frame == spriteX.length) {
                    frame = 0;
                }
                requestRef.current = spriteX[frame]
                setSprite(requestRef.current);
                setMood(spriteY)
                tPrecedent = tActuel;
            }
            requestAnimationFrame(spriteAnimation);
        };
        spriteAnimation(tempo)
    }
    useEffect(()=>{
        animateRequestFrame(tempo)
    }, [])

    return {sprite, mood}
}

export function useKeyPress(targetKey:string) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);

    // If pressed key is our target key then set to true
    function downHandler({ key }:KeyboardEvent) {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    }

    // If released key is our target key then set to false
    const upHandler = ({ key }:KeyboardEvent) => {
        if (key === targetKey) {
            setKeyPressed(false);
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
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
}

