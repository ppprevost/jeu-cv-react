import React, { CSSProperties, useEffect, useRef } from "react";
import keyboardArrow from "../img/arrow-key.png";
import styled from "styled-components";
import { useGameData } from "../store/GameProvider";
import { IS_CROUCHING, JUMP, MOVE_LEFT, MOVE_RIGHT } from "../constants";
import muzzle from "../img/muzzle-touch.png";
import dynamite from "../img/dynamite-touch.png";

const ContainerArrow = styled.div`
  position: absolute;
  left: 0%;
  bottom: 30px;
  width: 150px;
  font-size: 2rem;
  text-align: center;
  font-family: Mario, sans-serif;
`;

const ContainerKeyboard = styled.div`
  position: absolute;
  right: 0%;
  bottom: 30px;
  margin: 0;
  z-index: 5000;
  width: 100px;
  font-size: 2rem;
  text-align: center;
  font-family: Mario, sans-serif;
`;

const KeyboardArrow = styled.img`
  width: 120%;
  opacity: 0.4;
`;

const keyboardTouch: CSSProperties = {
  position: "absolute",
  width: "50px",
  height: "50px",
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
    dispatch({ type: IS_CROUCHING, stop } );
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

  const bulletButtonStyle: CSSProperties = {
    opacity: 0.5,
    width: 4 + "rem"
  };

  return (
    <>
      <ContainerKeyboard>
        <img
            alt={"dynamite"}
          style={bulletButtonStyle}
          src={dynamite}
          onTouchStart={launchDynamite}
        />
        <img
            alt={"muzzle"}
          style={{ ...bulletButtonStyle, marginLeft: "2rem" }}
          src={muzzle}
          onTouchStart={shoot}
        />
      </ContainerKeyboard>
      <ContainerArrow className="keyboard arrow">
        <div
          onTouchStart={jump}
          onTouchEnd={e => jump(e, true)}
          style={{ ...keyboardTouch, left: "67px", top: "2px" }}
        ></div>
        <div
          onTouchStart={moveLeft}
          onTouchEnd={event => moveLeft(event, true)}
          style={{ ...keyboardTouch, left: "7px", bottom: "7px" }}
        ></div>
        <div
          onTouchStart={crouch}
          onTouchEnd={e => crouch(e, true)}
          style={{ ...keyboardTouch, left: "67px", bottom: "7px" }}
        ></div>
        <div
          onTouchStart={moveRight}
          onTouchEnd={e => moveRight(e, true)}
          style={{ ...keyboardTouch, left: "125px", bottom: "7px" }}
        ></div>
        <KeyboardArrow src={keyboardArrow} alt="keyboardArrow" />
      </ContainerArrow>
    </>
  );
};

export default Keyboard;
