import React, { CSSProperties, SyntheticEvent, useEffect, useRef } from "react";
import keyboardArrow from "../img/arrow-key.png";
import styled from "styled-components";
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
  -webkit-user-select: none;
  z-index: 5000;
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
  zIndex: 5000
};

const Keyboard = () => {
  const timeStamp = useRef(0);

  const [
    {
      player: { position }
    },
    dispatch
  ] = useGameData();
  const shoot = (event: React.TouchEvent) => {
    event.preventDefault();
    if (!position.isShooting) {
      dispatch({ type: "SHOOT" });
    }
  };
  const setPause = (event: React.TouchEvent) => {
    event.preventDefault();
    dispatch({ type: "SET_PAUSE" });
  };
  const launchDynamite = (e: React.TouchEvent): void => {
    e.preventDefault();
    dispatch({ type: "IS_DYNAMITING" });
  };
  const moveLeft = (e: React.TouchEvent, stop?: boolean) => {
    e.preventDefault();
    dispatch({ type: MOVE_LEFT, stop });
  };
  const moveRight = (e: React.TouchEvent, stop?: boolean) => {
    e.preventDefault();
    dispatch({ type: MOVE_RIGHT, stop });
  };
  const jump = (e: React.TouchEvent, stop?: boolean) => {
    e.preventDefault();
    dispatch({ type: JUMP, stop });
  };
  const crouch = (e: React.TouchEvent, stop?: boolean) => {
    e.preventDefault();
    dispatch({ type: IS_CROUCHING }, stop);
  };

  useEffect(() => {
    window.addEventListener("touchstart", function(event_) {
      if (event_.timeStamp - timeStamp.current < 300) {
        // A tap that occurs less than 300 ms from the last tap will trigger a double tap. This delay may be different between browsers.
        event_.preventDefault();
        return false;
      }
      timeStamp.current = event_.timeStamp;
    });
  }, []);

  return (
      <>
        <ContainerKeyboard>
          <p className="no-margin" onTouchStart={setPause}>
            P - Pause
          </p>
          <p className="no-margin" onTouchStart={launchDynamite}>
            D - Dynamite
          </p>
          <p className="no-margin" onTouchStart={shoot}>
            Space - Shoot
          </p>
        </ContainerKeyboard>
        <ContainerArrow className="keyboard arrow">
          <span>Use Arrow</span>
          <div
              onTouchStart={jump}
              onTouchEnd={e => jump(e, true)}
              style={{ ...keyboardTouch, left: "56px" }}
          ></div>
          <div
              onTouchStart={moveLeft}
              onTouchEnd={event => moveLeft(event, true)}
              style={{ ...keyboardTouch, left: "7px", bottom: "5px" }}
          ></div>
          <div
              onTouchStart={crouch}
              onTouchEnd={e => crouch(e, true)}
              style={{ ...keyboardTouch, left: "55px", bottom: "5px" }}
          ></div>
          <div
              onTouchStart={moveRight}
              onTouchEnd={e => moveRight(e, true)}
              style={{ ...keyboardTouch, left: "103px", bottom: "5px" }}
          ></div>
          <KeyboardArrow src={keyboardArrow} alt="keyboardArrow" />
        </ContainerArrow>
      </>
  );
};

export default Keyboard;
