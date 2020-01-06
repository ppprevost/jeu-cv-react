import React, { useMemo, lazy, Suspense, CSSProperties } from "react";
import "./App.css";
import background from "./img/fond.png";
import GameProvider, { useGameData } from "./store/GameProvider";
import Intro from "./page/Intro";
import MainHeader from "./components/MainHeader";
import { useWindowSize } from "./helpers/hooks";
const Game = lazy(() => import("./page/Game"));

export const MainHeaderMemoized = () => {
  return useMemo(() => <MainHeader />, []);
};
const App = () => (
  <GameProvider>
    <Play />
  </GameProvider>
);

const Play = () => {
  const { windowHeight } = useWindowSize();
  const style: CSSProperties = {
    background: `url("${background}")repeat-x`,
    overflow: "hidden",
    width: 100 + "%",
    margin: "0 auto",
    maxHeight: 580 + "px",
    position: "relative",
    maxWidth: 1400 + "px"
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
    </div>
  );
};

export default App;
