import React, { useEffect, useState } from "react";
import { useGameData } from "../store/GameProvider";
import { useChrono } from "../helpers/hooks";

const MainHeader = React.memo(() => {
  const [
    {
      sound,
      player: { health, maskEfficient, score },
        friend,
      win,
      chrono: { second, minute }
    },
    dispatch
  ] = useGameData();
  const setSound = () => dispatch({ type: "SET_SOUND" });
  useChrono();
  const [chronoHeader, setChronoHeader] = useState("01:00");
  const resetGame = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!win) dispatch({ type: "RESET_GAME" });
  };
  const setPause = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch({ type: "SET_PAUSE" });
  };
  useEffect(() => {
    if (second < 10 && minute < 10) {
      setChronoHeader("0" + minute + ": 0" + second);
    }
    if (second >= 10 && minute < 10) {
      setChronoHeader("0" + minute + ": " + second);
    }
  }, [second, minute]);
  return (
    <div className="container" id={"main-header"}>
      <div className="row tableau misc">
        <div className="col-xs-3 text-center">
          <div className="glyphicon glyphicon-time" aria-hidden="true"></div>
          <span>Surviving Time</span>
          <div id="counter">
            <div className="nextskill">{chronoHeader}</div>
          </div>
        </div>
        <div className="col-xs-3 text-center">
          <div className="glyphicon glyphicon-heart"></div>
          <span>Health</span>
          <div id="health">{health}</div>
        </div>
        <div className="col-xs-3 text-center">
          <div className="glyphicon glyphicon-flash"></div>
          <span>Mask</span>
          <div id="supply">{maskEfficient}</div>
        </div>

        <div className="col-xs-3 text-center">
          <div className="glyphicon glyphicon-usd"></div>
          <span>Score </span>
          <div id="score">{score}</div>
        </div>
      </div>

      <div className="row sub-menu misc">
        <div className="cv col-xs-3">
          <a href="https://github.com/ppprevost/jeu-cv-react" target="_blank" rel="noopener noreferrer">
            Github
          </a>
        </div>
        <div className="cv col-xs-3">
          <div onClick={setPause}>
            Pause
          </div>
        </div>
        <div onClick={resetGame} className="startAgain col-xs-3">
          Start Again
        </div>
        <div className="col-xs-3 sound" onClick={setSound}>
          Sound {sound ? "on" : "off"}
        </div>
      </div>
      <div className={`${friend && friend.isSick && 'blind'} row sub-menu misc`}>{friend && !friend.isSick? 'take care of the princess': 'Princess is sick !'}</div>
    </div>
  );
});

export default MainHeader;
