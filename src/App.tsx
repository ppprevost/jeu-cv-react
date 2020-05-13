import React, { useMemo, lazy, Suspense, CSSProperties } from "react";
import "./App.css";
import background from "./img/fond.png";
import GameProvider, { useGameData } from "./store/GameProvider";
import Intro from "./page/Intro";
import { useWindowSize } from "./helpers/hooks";
import Tutorial from "./page/Tutorial";
const Game = lazy(() => import("./page/Game"));

const skarahb =
  "https://e-cdns-images.dzcdn.net/images/cover/758113bb674a43d1a87a93eb89c16b5e/298x298-000000-100-1-1.jpg";

const App = () => (
  <GameProvider>
    <Play />
  </GameProvider>
);

const Play = () => {
  const { windowHeight } = useWindowSize();
  const [{ win }] = useGameData();
  const style: CSSProperties = {
    background: `url("${win ? skarahb : background}")repeat`,
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
      {gameType === "tutorial" && (
          <Suspense fallback={"is loading"}>
            <Tutorial />
          </Suspense>
      )}
    </div>
  );
};

export default App;
