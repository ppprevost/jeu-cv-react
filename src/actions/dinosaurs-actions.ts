import {useGameData} from "../store/GameProvider";
import {ADD_DINO, COLLISION, DELETE_DINO, MOVE_DINO} from "../constants";
import {RefObject} from "react";
import {EnemyInit} from "../data/ennemies";

const useActionDinosaurs = () => {
    const [, dispatch] = useGameData();
    const deleteDinosaurs = (id: string | number) => {
        dispatch({type: DELETE_DINO, payload: {id}});
    }
    const moveDinosaurs = (refPosition: RefObject<number>, id: number) => {
        dispatch({type: MOVE_DINO, payload: {x: refPosition.current, id}});
    }
    const addPangolin = (newPang:EnemyInit)=> dispatch({type:'ADD_PANGOLIN', payload:newPang})
    const collision = (id:number) => dispatch({type: COLLISION, id})
    const makeFriendSick = (id:string)=>dispatch({type:"FRIEND_IS_SICK", id})
    const addEnemy = (newDino:EnemyInit)=> dispatch({ type: ADD_DINO, newDino });
    return {deleteDinosaurs, moveDinosaurs, collision, addEnemy, makeFriendSick, addPangolin}
}

export default useActionDinosaurs


