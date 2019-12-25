export const repercutPositionHero = (state: any, newPosition: string, stop?: boolean) => {
    let initObject: typeof state.player.position = {};
    const reinitAndRefreshUniquePosition = ()=>Object.keys(state.player.position)
        .map((key) => {
            return (initObject as any)[key] = false
        });
    if (state.player && !state.pause) {
        if (newPosition === "isJumping") {
            initObject = {...state.player.position}
            if (stop) {
                if (!state.player.position.isRunning && !state.player.position.isRunningLeft && !state.player.position.isCrouching) {
                    console.log('idle after jump')
                    initObject.isIdle = true;
                }
                initObject.isJumping = false;
            } else {
                initObject.isJumping = true;
                initObject.isIdle = false;
            }
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }

        }
        if (newPosition === "isCrouching") {
            initObject = {...state.player.position}
            console.log('isCrouch', initObject, stop)
            if (stop) {
                if (!state.player.position.isRunning && !state.player.position.isRunningLeft && !state.player.position.isJumping) {
                    initObject.isIdle = true;

                }
                initObject.isCrouching = false;
            } else {
                initObject.isRunning = false;
                initObject.isRunningLeft = false;
                initObject.isCrouching = true;
                initObject.isIdle = false;

            }
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }
        }
        if (newPosition === "isShooting") {
            initObject = {...state.player.position}
            if (stop) {
                initObject.isShooting = false;
            } else {
                initObject.isShooting = true;
            }
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }
        }
        if (newPosition === "isHurting") {
            initObject = {...state.player.position}
            if (stop) {
                initObject.isHurting = false;

            } else {
                initObject.isHurting = true;
            }
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }
        }
        if (newPosition === "isRunning") {
            initObject = {...state.player.position}
            if (stop ) {
                console.log('gamePor run',initObject.isRunning)
                initObject.isRunning = false;
                if (!initObject.isJumping) {
                    initObject.isIdle = true;
                }
            } else {
                console.log('running')
                initObject.isRunning = true;
                initObject.isRunningLeft = false;
                initObject.isIdle = false;
            }
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }
        }
        if (newPosition === "isRunningLeft") {
            initObject = {...state.player.position}
            if (stop) {
                if (!initObject.isJumping) {
                    initObject.isIdle = true;
                }
                initObject.isRunningLeft = false;
            } else {
                initObject.isIdle = false;
                initObject.isRunning = false;
                initObject.isRunningLeft = true;
            }
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }
        }
        if (newPosition === 'isDynamiting') {
            initObject = {...state.player.position}
            if (stop) {
                initObject.isDynamiting = false;
            } else {
                initObject.isDynamiting = true;
            }
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }

        }
        if (newPosition === "isIdle") {
            initObject = {...state.player.position}
            initObject.isRunning = false;
            initObject.isRunningLeft = false;
            initObject.isJumping = false;
            initObject.isCrouching = false;
            initObject.isHurting = false;
            initObject.isIdle = true;
            return {
                ...state,
                player:
                    {...state.player, position: {...initObject}}
            }
        }

        return {
            ...state,
            player:
                {...state.player, position: {...initObject, [newPosition]: true,}}
        }

    }
    return state
}