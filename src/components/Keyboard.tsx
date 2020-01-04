import React from "react";
import keyboardArrow from "../img/arrow-key.png";
import styled from "styled-components";
import keyboard from "../img/keyboard.png";
import { useGameData } from "../store/GameProvider";

const ContainerArrow = styled.div`
  position: absolute;
  left: 10%;
  width: 100px;
  font-size: 2rem;
  text-align: center;
  font-family: Jurassik, sans-serif;
`;

const ContainerKeyboard = styled.div`
  position: absolute;
  left: 80%;
  margin: 0;
  width: 100px;
  font-size: 2rem;
  text-align: center;
  font-family: Jurassik, sans-serif;
`;

const KeyboardArrow = styled.img`
  width: 100%;
  opacity: 0.3;
`;

const Keyboard = () => {
  const [
    {
      player: { position }
    },
    dispatch
  ] = useGameData();
  const shoot = () => {
    if (!position.isShooting) {
      dispatch({ type: "SHOOT" });
    }
  };
  const setPause = () => {
    dispatch({ type: "SET_PAUSE"});
  };
  const launchDynamite = () => {
      dispatch({type: 'IS_DYNAMITING'})
  };

  return (
    <>
      <ContainerKeyboard>
        <p className="no-margin" onClick={setPause}>
          P - Pause
        </p>
        <p className="no-margin" onClick={launchDynamite}>
          D - Dynamite
        </p>
        <p className="no-margin" onClick={shoot}>
          Space - Shoot
        </p>
      </ContainerKeyboard>
      <ContainerArrow className="keyboard arrow">
        <p>Use Arrow</p>
        <KeyboardArrow src={keyboardArrow} alt="keyboardArrow" />
      </ContainerArrow>
    </>
  );
};

export default Keyboard;
