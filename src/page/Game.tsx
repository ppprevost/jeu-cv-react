import React, {useEffect, useRef, useMemo, Suspense, useCallback} from "react";
import { useGameData } from "../store/GameProvider";
import { ADD_PLAYER, ADD_DINO } from "../constants";
import Hero from "../components/Hero";
import Dinosaurs from "../components/Dinosaurs";
import Competency from "../components/Competency";
import Background, { Field } from "../components/Background";
import { useCalculateIntervalDino, useInterval } from "../helpers/hooks";
import mainSound from "../sound/main.mp3";
import { ModalGameOver, ModalPause, ModalWin } from "../components/Modal";
import { createDinosaur } from "../helpers/ennemies_helpers";
import useActionDinosaurs from "../actions/dinosaurs-actions";
import MainHeader from "../components/MainHeader";
import Keyboard from "../components/Keyboard";
import Bullet from "../components/Bullet";
import {useKeyPress} from "../helpers/hooks";

const ambianceSound = new Audio(mainSound);
const xBackground = window.innerWidth / 4;
const FixedBackground = (compute: number) =>
  useMemo(() => <Background left={compute} />, [xBackground]);

const Game = () => {
  const [
    {
      player,
      dino,
      gameOver,
      sound,
      bullets,
      competency,
      win,
      pause,
      windowInfo: { windowSize, landscape, isMobile }
    },
    dispatch
  ] = useGameData();
  const setPauseOff = () => {
    dispatch({ type: "SET_PAUSE", payload: false });
  };
  const intervalDino = useCalculateIntervalDino();
  const { addEnemy } = useActionDinosaurs();
  const newRef = useRef(createDinosaur(windowSize));
  const visibilityGame = useRef(true); // bug fixing
  const id = useInterval(() => {
    visibilityGame.current = document.visibilityState === "visible";
    newRef.current = createDinosaur(windowSize);
    if (visibilityGame.current && landscape)
      addEnemy(newRef.current)
    if (gameOver) {
      clearInterval(id);
    }
  }, intervalDino);
  useEffect(() => {
    dispatch({ type: ADD_PLAYER });
  }, []);

  useEffect(() => {
    if (sound && !gameOver && !win) {
      ambianceSound.play();
      ambianceSound.loop = true;
      ambianceSound.volume = 0.07;
    } else {
      ambianceSound.pause();
    }
  }, [sound, gameOver, win]);
  return (
    <>
      {FixedBackground(xBackground)}
      {FixedBackground(xBackground * 2)}
      {FixedBackground(xBackground * 3)}
      {dino.map(dinosaur => (
        <Dinosaurs {...dinosaur} key={dinosaur.id} />
      ))}
      {useMemo(() => isMobile && <Keyboard />, [isMobile])}
      {win && <ModalWin />}
      {gameOver && <ModalGameOver />}
      {competency
        .filter(elem => !elem.catched)
        .map(elem => (
          <Competency key={elem.type} {...elem} />
        ))}
      <Field />
      {player && (
        <Suspense fallback={"waiting player"}>
          {<MainHeader />}
          {pause && <ModalPause setPauseOff={setPauseOff} />}
          {<Hero {...player} />}
          {bullets.length > 0 &&
            bullets.map(bull => <Bullet key={bull.id} {...bull} />)}
        </Suspense>
      )}
    </>
  );
};

export default Game;
