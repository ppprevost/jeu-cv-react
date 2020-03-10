import {useGameData} from "../store/GameProvider";
import {COLLISION, DELETE_DINO, MOVE_DINO} from "../constants";


export const useActionDinosaurs = () => {
    const [, dispatch] = useGameData();

    const deleteDinosaurs = (id: string | number) => {
        dispatch({type: DELETE_DINO, payload: {id}});
    }
    const moveDinosaurs = (refPosition: any, id: any) => {
        dispatch({type: MOVE_DINO, payload: {x: refPosition.current, id}});
    }
    const collision = () => dispatch({type: COLLISION})


    return {deleteDinosaurs, moveDinosaurs, collision}
}


