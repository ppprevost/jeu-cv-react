import React, { useMemo, lazy, Suspense } from "react";
import "./App.css";
import GameProvider, { useGameData } from "./store/GameProvider";
import Intro from "./page/Intro";
import MainHeader from "./components/MainHeader";
import styled from "styled-components";
import { windowHeight } from "./constants/contants";
const Game = lazy(() => import("./page/Game"));

const MainHeaderMemoized = () => {
  return useMemo(() => <MainHeader />, []);
};
const App = () => (
  <GameProvider>
    <Play />
  </GameProvider>
);

const ContainerGame = styled.div`
  background: url("https://res.cloudinary.com/hkszuuqf3/image/upload/v1578145649/fond_npi9t5.png")
    repeat-x;
  overflow: hidden;
  width: 100%;
  margin: 0 auto;
  height: ${windowHeight + "px"};
  max-height: 580px;
  position: relative;
  max-width: 1400px;
`;

const Play = () => {
  const [{ player, gameType, intro }] = useGameData();
  return (
    <ContainerGame>
      {player && <MainHeaderMemoized />}
      {intro && <Intro />}
      {gameType === "game" && (
        <Suspense fallback={"is loading"}>
          <Game />
        </Suspense>
      )}
    </ContainerGame>
  );
};

export default App;
