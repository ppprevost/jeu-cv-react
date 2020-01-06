import React, { useEffect, useRef, useMemo } from "react";
import { useGameData } from "../store/GameProvider";
import { ADD_PLAYER, ADD_DINO } from "../constants";
import Hero from "../components/Hero";
import Dinosaurs from "../components/Dinosaurs";
import Competency from "../components/Competency";
import Background, { Field } from "../components/Background";
import { useInterval, useWindowSize } from "../helpers/hooks";
import mainSound from "../sound/main.mp3";
import { ModalGameOver, ModalPause, ModalWin } from "../components/Modal";
import { createDinosaur } from "../helpers/ennemies_helpers";

const ambianceSound = new Audio(mainSound);

export const useCalculateIntervalDino = () => {
  const [{ player }] = useGameData();
  const { windowSize } = useWindowSize();
  const delayRef = useRef(0);
  let [size, interval] = [800, 1700];
  const diff = size - windowSize;
  interval += diff * 1.7;
  console.log(interval);
  useEffect(() => {
    delayRef.current = interval;
  }, [windowSize, interval]);
  useEffect(() => {
    if (player) {
      delayRef.current -= 10;
    }
  }, [player && player.score]);
  return Math.round(delayRef.current);
};
const xBackground = window.innerWidth / 4;
const FixedBackground = (compute: number) =>
  useMemo(() => <Background left={compute} />, [xBackground]);

const Game = () => {
  const [
    { player, dino, gameOver, sound, competency, win, pause },
    dispatch
  ] = useGameData();
  const intervalDino = useCalculateIntervalDino();
  const newRef = useRef(createDinosaur());
  const visibilityGame = useRef(true); // bug fixing
  const id = useInterval(() => {
    visibilityGame.current = document.visibilityState === "visible";
    newRef.current = createDinosaur();
    if (visibilityGame.current)
      dispatch({ type: ADD_DINO, newDino: newRef.current });
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
      {useMemo(() => pause && <ModalPause />, [pause])}
      {useMemo(() => win && <ModalWin />, [win])}
      {useMemo(() => gameOver && <ModalGameOver />, [gameOver])}
      {useMemo(
        () =>
          competency
            .filter((elem: any) => !elem.catched)
            .map((elem: any) => <Competency key={elem.type} {...elem} />),
        [competency]
      )}
      {FixedBackground(xBackground)}
      {FixedBackground(xBackground * 2)}
      {FixedBackground(xBackground * 3)}
      {useMemo(() => player && <Hero {...player} />, [player])}
      {dino.map(dinosaur => (
        <Dinosaurs {...dinosaur} key={dinosaur.id} />
      ))}
      <Field />
    </>
  );
};

export default Game;
