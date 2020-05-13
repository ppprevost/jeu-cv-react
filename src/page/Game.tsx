import React, { useEffect, useRef, useMemo } from "react";
import { useGameData } from "../store/GameProvider";
import { ADD_PLAYER } from "../constants";
import Hero from "../components/Hero";
import Background, { Field } from "../components/Background";
import { useInterval } from "../helpers/hooks";
import peachThankYou from '../sound/peach5.wav';
import { ModalGameOver, ModalPause, ModalWin } from "../components/Modal";
import { createEnemy} from "../helpers/ennemies_helpers";
import useActionDinosaurs from "../actions/dinosaurs-actions";
import MainHeader from "../components/MainHeader";
import Keyboard from "../components/Keyboard";
import Friends from "../components/Friends";
import Castle from '../components/Castle';
import Pangolin from "../components/Pangolin";
import Box from "../components/Box";
import Mask from "../components/Misc";
import main from '../sound/main.mp3';
import mamamia from "../sound/mario-mamamia.wav";
import { casesConstant } from "../constants/contants";
import Virus from "../components/Virus";
import Mushroom from "../components/Misc/Mushroom";
const xBackground = window.innerWidth / 4;
const FixedBackground = (compute: number) =>
  useMemo(() => <Background left={compute} />, [xBackground]);

const mainAudio = new Audio(main)

const peachThankYouAudio = new Audio(peachThankYou);

const Game = () => {
  const [
    {
      player,
      dino,
      bonus,
        friend,

      gameOver,
      sound,
        pangolin,
        misc,
      win,
      pause,
      windowInfo: { windowSize, isMobile }
    },
    dispatch
  ] = useGameData();
  const setPauseOff = () => {
    dispatch({ type: "SET_PAUSE", payload: false });
  };
  const { width, intervalWithScreen } = casesConstant;
  type Position = "left" | "right";

   const exactPos: Record<Position, number> = {
    left: intervalWithScreen,
    right: windowSize - (width + intervalWithScreen)
  };

  const {  addPangolin } = useActionDinosaurs();
  const newRef = useRef(createEnemy(windowSize,  "pangolin"));
  const visibilityGame = useRef(true);
  const id = useInterval(() => {
    visibilityGame.current = document.visibilityState === "visible";

newRef.current = createEnemy(windowSize, "pangolin")
    addPangolin(newRef.current)
    if (gameOver) {
      clearInterval(id);
    }
  }, 2000);
  useEffect(() => {
    dispatch({ type: ADD_PLAYER });
    dispatch({type:"ADD_FRIEND"})
    dispatch({
      type: "EXACT_CASE_POSITION",
      payload: { ...casesConstant, type: "left", left: (exactPos as any).left }
    });
    dispatch({
      type: "EXACT_CASE_POSITION",
      payload: {
        ...casesConstant,
        type: "right",
        left: (exactPos as any).right
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (sound && !gameOver && !win) {
      mainAudio.play();
      mainAudio.loop = true;
      mainAudio.volume = 0.3;
    }
  }, [sound, gameOver, win]);
  useEffect(()=>{
    if(win){
      peachThankYouAudio.play()
    }
  }, [win])
  return (
    <>
      {FixedBackground(xBackground)}
      {FixedBackground(xBackground * 2)}
      {FixedBackground(xBackground * 3)}
      {useMemo(() => isMobile && <Keyboard />, [isMobile])}
      {gameOver && <ModalGameOver />}

<Castle />
      {Object.entries(bonus).map(
        ([key, { type, bottom, left, height, width, hit }]: any) => (
          <Box
            key={key}
            type={type}
            hit={hit}
            left={left}
            bottom={bottom}
            height={height}
            width={width}
          />
        )
      )}
      {Object.entries(misc)
          .map(([key, props])=>{
              return (props as any).type==='mask' ? <Mask key={key} {...props} /> : <Mushroom key={key} {...props}/>})
      }
      {player && (
        <>
          {win && <ModalWin />}
          {friend && <Friends {...friend} />}
          {Object.entries(pangolin).map(([key,props])=><Pangolin key={key} id={key} {...props}/>)}
          {dino.map(dinosaur => (
            <Virus {...dinosaur} key={dinosaur.id} />
          ))}
          {<MainHeader />}
          {pause && <ModalPause setPauseOff={setPauseOff} />}
          {<Hero {...player} />}
        </>
      )}
    </>
  );
};

export default Game;
