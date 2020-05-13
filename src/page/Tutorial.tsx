import React, { useEffect, useRef, useState } from "react";
import Dinosaurs from "../components/Dinosaurs";
import { Popover, PopoverBody } from "reactstrap";
import { wait } from "../helpers/main_helpers";
import { useGameData } from "../store/GameProvider";
import { EnemyInit, peaksInit, raptorInit } from "../data/ennemies";
import Hero from "../components/Hero";
import { ADD_PLAYER, MOVE_LEFT } from "../constants";
import { windowSize } from "../constants/contants";
import { Field } from "../components/Background";
import useActionDinosaurs from "../actions/dinosaurs-actions";
import Bullet from "../components/Bullet";

const firstContent = "Be careful, there is a dinosaur";
const shootDino = "Use space to shoot, or key D to use Dynamite.";
const dinoIsDead = "That's good, we are safe for now";

const picArrive =
  "When you see this spike, you have to maintain up key to jump. Try it !";

const okPic = "you are okay with the jump";
const arriveOfVine = "Push down to crouch. It could be useful for the vines !";

const recap =
  "Move around, jump and crouch. Shoot and use dynamite during this 10 seconds! Are you ready ?";

const Tutorial = () => {
  const [{ dino, player, bullets }, dispatch] = useGameData();
  const { addEnemy, deleteDinosaurs } = useActionDinosaurs();
  const step1 = async () => {
    dispatch({ type: ADD_PLAYER });
    await wait(2000);
    const raptor = raptorInit();
    raptor.avatar = raptor.avatar[0];
    raptor.x = windowSize;
    addEnemy(raptor);
    setPopoverOpen(firstContent);
    await wait(1000);
    setPopoverOpen("");
    await wait(1000);
    setPopoverOpen(shootDino);
    await wait(2000);
    setPopoverOpen("");
    await wait(2000);
  };

  const step2 = async () => {
    setPopoverOpen(dinoIsDead);
    await wait(2000);
    setPopoverOpen("");
    const pics = peaksInit as EnemyInit;
    pics.x = windowSize;
    addEnemy(pics);
    await wait(2000);
    setPopoverOpen("");
    setPopoverOpen(picArrive);
    await wait(8000);
    setPopoverOpen("");
  };

  const step3 = async () => {
    await wait(2000);
    setPopoverOpen("");
    setPopoverOpen(okPic);
    deleteDinosaurs(0);
    await wait(2000);
    setPopoverOpen("");
    await wait(1000);
    setPopoverOpen(arriveOfVine);
    await wait(4000);
    setPopoverOpen("");
    await wait(2000);
    setPopoverOpen(recap);
    await wait(4000);
    setPopoverOpen("");
    await wait(10000);
    step5();
  };

  const step5 = async () => {
    dispatch({ type: "RESET_GAME" });
  };

  useEffect(() => {
    (async function() {
      console.log(dino[0]?.className, player?.position);
      if (
        player?.position.isJumping &&
        dino &&
        dino[0]?.className === "spike"
      ) {
        await step3();
      }
    })();
  }, [player?.position, dino[0]]);
  const [speaker, setSpeaker] = useState("hero");
  const [popoverOpen, setPopoverOpen] = useState("");
  const toggle = () => setPopoverOpen("");
  useEffect(() => {
    (async function() {
      await step1();
    })();
  }, []);

  useEffect(() => {
    (async function() {
      console.log(dino[0]?.alive);
      if (dino[0] && dino[0]?.alive === false) {
        await step2();
      }
    })();
  }, [dino[0]?.alive]);

  return (
    <>
      {dino.map(elem => (
        <Dinosaurs {...elem} />
      ))}
      {player && <Hero {...player} />}
      {bullets.length > 0 &&
        bullets.map(bull => <Bullet key={bull.id} {...bull} />)}
      {popoverOpen && (
        <Popover
          placement="top-end"
          isOpen={!!popoverOpen}
          target={speaker}
          toggle={toggle}
        >
          <PopoverBody>{popoverOpen}</PopoverBody>
        </Popover>
      )}
      <Field />
    </>
  );
};

export default Tutorial;
