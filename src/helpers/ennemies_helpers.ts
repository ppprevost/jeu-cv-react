import { useRef } from "react";
import { windowSize } from "../constants/contants";
import {
  diploInit,
  EnemyInit,
  peaksInit,
  pteroInit,
  raptorInit,
  vinesInit
} from "../data/ennemies";
import raptorNoise from "../sound/raptor.mp3";
import pteroNoise from "../sound/pterodactyl.mp3";
import diploNoise from "../sound/diplo.mp3";
import { initHeroes } from "../data/player";

export const createDinosaur = (): EnemyInit => {
  const tableDinosaur = [
    pteroInit,
    pteroInit,
    raptorInit(),
    raptorInit(),
    diploInit,
    diploInit,
    peaksInit,
    vinesInit
  ];
  const random = Math.round(Math.random() * (tableDinosaur.length - 1));
  const chosenDinosaur = { ...tableDinosaur[random] } as EnemyInit;
  const randomPosition = [windowSize, -chosenDinosaur.width][
    Math.round(Math.random())
  ];
  chosenDinosaur.x =
    chosenDinosaur.avatar.length > 1 ||
    chosenDinosaur.className === "spike" ||
    chosenDinosaur.className === "vine"
      ? randomPosition
      : windowSize;
  chosenDinosaur.avatar =
    randomPosition === windowSize || chosenDinosaur.avatar.length < 2
      ? chosenDinosaur.avatar[0]
      : chosenDinosaur.avatar[1];
  return chosenDinosaur;
};

export const takeSoundChoice = (idSound: string, sound: boolean) => {
  const soundChoice = {
    raptor: raptorNoise,
    ptero: pteroNoise,
    diplo: diploNoise
  };
  for (let [s, val] of Object.entries(soundChoice)) {
    if (idSound === s) {
      const soundAudio = new Audio(val);
      if (sound) {
        soundAudio.currentTime = 0;
        soundAudio.volume = 0.3;
        soundAudio.play();
      } else {
        soundAudio.pause();
      }
    }
  }
};

export const conditionToConflict = (
  className: string,
  positionHero: number,
  refPosition: any,
  width: number,
  player: typeof initHeroes,
  y: number,
  height: number
) => {
  const playerHeight = player.exactSpriteObject.height;
  if (className === "vine") {
    if (!player.position.isCrouching) {
      return (
        positionHero >= refPosition.current &&
        positionHero <= refPosition.current + width
      );
    }
    return false
  }
  return (
    positionHero >= refPosition.current &&
    positionHero <= refPosition.current + width &&
    player.y + playerHeight >= y &&
    player.y + playerHeight <= y + height
  );
};
