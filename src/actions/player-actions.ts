import React from "react";
import { useGameData } from "../store/GameProvider";
import {
  GET_COMPETENCY,
  JUMP,
  LAND_PLAYER,
  MOVE_LEFT,
  MOVE_RIGHT
} from "../constants";
import { Competency } from "../components/Competency";

export const usePlayerActions = () => {
  const [, dispatch] = useGameData();
  const shootKeyAction = () => {
    dispatch({ type: "SHOOT" });
  };
  const isDynamitingKeyAction = () => {
    dispatch({ type: "IS_DYNAMITING" });
  };

  const moveLeftKeyAction = (stop: boolean) => {
    dispatch({ type: MOVE_LEFT, stop });
  };
  const moveRightKeyAction = (stop: boolean) => {
    dispatch({ type: MOVE_RIGHT, stop });
  };
  const jumpKeyAction = (stop: boolean) => {
    dispatch({ type: JUMP, stop });
  };

  const getCompetency = (comp: Competency) => {
    dispatch({ type: GET_COMPETENCY, payload: { newComp: comp.type } });
  };
  const playerIsLanding = () => {
    dispatch({ type: LAND_PLAYER });
  };
  const stopJumping = () => {
    dispatch({ type: "STOP_JUMPING" });
  };
  const animatePlayer = (
    refPosition: React.RefObject<number>,
    refPositionY: React.RefObject<number>
  ) => {
    dispatch({
      type: "ANIMATE_PLAYER",
      x: refPosition.current,
      y: refPositionY.current
    });
  };
  const stopShooting = () => {
    dispatch({ type: "STOP_SHOOTING" });
  };
  return {
    shootKeyAction,
    isDynamitingKeyAction,
    moveLeftKeyAction,
    moveRightKeyAction,
    jumpKeyAction,
    getCompetency,
    playerIsLanding,
    stopJumping,
    animatePlayer,
    stopShooting
  };
};
