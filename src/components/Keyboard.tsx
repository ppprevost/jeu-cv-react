import React, { CSSProperties } from "react";
import keyboardArrow from "../img/arrow-key.png";
import styled from "styled-components";
import keyboard from "../img/keyboard.png";
import { useGameData } from "../store/GameProvider";
import { IS_CROUCHING, JUMP, MOVE_LEFT, MOVE_RIGHT } from "../constants";

const ContainerArrow = styled.div`
  position: absolute;
  left: 0%;
  bottom: 30px;
  width: 150px;
  font-size: 2rem;
  text-align: center;
  font-family: Jurassik, sans-serif;
`;

const ContainerKeyboard = styled.div`
  position: absolute;
  right: 0%;
  bottom: 30px;
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

const keyboardTouch: CSSProperties = {
  position: "absolute",
  width: "42px",
  height: "45px",
  zIndex:5000
};

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
    dispatch({ type: "SET_PAUSE" });
  };
  const launchDynamite = () => {
    dispatch({ type: "IS_DYNAMITING" });
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
      <ContainerArrow
        className="keyboard arrow"
      >
        <span>Use Arrow</span>
        <div
          onTouchStart={() => dispatch({ type: JUMP })}
          onTouchEnd={() => dispatch({ type: JUMP, stop: true })}
          style={{ ...keyboardTouch, left: "56px" }}
        ></div>
        <div
          onTouchStart={() => dispatch({ type: MOVE_LEFT })}
          onTouchEnd={() => dispatch({ type: MOVE_LEFT, stop: true })}
          style={{ ...keyboardTouch, left: "7px", bottom: "5px" }}
        ></div>
        <div
          onTouchStart={() => dispatch({ type: IS_CROUCHING })}
          onTouchEnd={() => dispatch({ type: IS_CROUCHING, stop: true })}
          style={{ ...keyboardTouch, left: "55px", bottom: "5px" }}
        ></div>
        <div
          onTouchStart={() => dispatch({ type: MOVE_RIGHT })}
          onTouchEnd={() => dispatch({ type: MOVE_RIGHT, stop: true })}
          style={{ ...keyboardTouch, left: "103px", bottom: "5px" }}
        ></div>
        <KeyboardArrow src={keyboardArrow} alt="keyboardArrow" />
      </ContainerArrow>
    </>
  );
};

export default Keyboard;
