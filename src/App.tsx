import React, { useMemo, lazy, Suspense, CSSProperties } from "react";
import "./App.css";
import background from "./img/fond.png";
import GameProvider, { useGameData } from "./store/GameProvider";
import Intro from "./page/Intro";
import { useWindowSize } from "./helpers/hooks";
import Tutorial from "./page/Tutorial";
import {Field} from "./components/Background";
const Game = lazy(() => import("./page/Game"));

const App = () => (
  <GameProvider>
    <Play />
  </GameProvider>
);

const Play = () => {
  const { windowHeight } = useWindowSize();
  const style: CSSProperties = {
    background: `url("${ background}")repeat`,
    overflow: "hidden",
    width: 100 + "%",
    margin: "0 auto",
    maxHeight: 580 + "px",
    position: "relative",
  };

  const [{ gameType, intro }] = useGameData();
  return (
    <div style={{ ...style, height: windowHeight + "px" }}>
      {intro && <Intro />}
      {gameType === "game" && (
        <Suspense fallback={"is loading"}>
          <Game />
        </Suspense>
      )}
      {gameType=== "tutorial" && <Tutorial />}
      <Field />

    </div>
  );
};

export default App;
