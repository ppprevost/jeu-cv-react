import React, { useEffect, useRef, useState } from "react";
import Castle from "../components/Castle";
import Friends from "../components/Friends";
import { casesConstant, windowSize } from "../constants/contants";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import { wait } from "../helpers/main_helpers";
import Pangolin from "../components/Pangolin";
import { useGameData } from "../store/GameProvider";
import { createEnemy } from "../helpers/ennemies_helpers";
import { EnemyInit } from "../data/ennemies";
import Hero from "../components/Hero";
import { ADD_PLAYER, MOVE_LEFT } from "../constants";
import Box from "../components/Box";
import Mask from "../components/Misc";
import Mushroom from "../components/Misc/Mushroom";

const peach = {
  id: "peach",
  width: 105,
  height: 160,
  isSick: false,
  x: windowSize / 2,
  y: 30
};

const firstContent = "Oh ! What a lovely weather!";
const seePangolin =
  "Oh Mario, come see this little animal here ! I want this kind of animal in the castle";
const marioSay =
  "Oh my princess, stay away from this cute animal. Bowser gave it the virus ! Please stay safe at home";
// "rire princess"
const boxmarioSay =
  "When you see a pangolin you just have to be close to it to push him away.  ";
const boxmarioJump = "Now jump to take your mask";

const freeRide =
  "You can now move around. Use the key Left and Right;  To save the princess ";
const freeRide2 =
  "you have to stay for 1:20 mm and you finish the party. If the princess is sick, hit the box and you could get the helth mushroom ";


const newPang = createEnemy(windowSize, "pangolin", {
  direction: "right",
  x: 0
});

const Tutorial = () => {
  const [{ pangolin, player, bonus, misc }, dispatch] = useGameData();
  const { width, intervalWithScreen } = casesConstant;
  const exactPos: Record<any, number> = {
    left: intervalWithScreen,
    right: windowSize - (width + intervalWithScreen)
  };

  const step1 = async () => {
    setPopoverOpen(firstContent);
    await wait(3000);
    console.log("srqf");
    setPopoverOpen("");
  };

  const step2 = async () => {
    setPopoverOpen(seePangolin);
    dispatch({ type: "ADD_PANGOLIN", payload: newPang });
    await wait(6000);
    setPopoverOpen("");
  };

  const step3 = async () => {
    dispatch({ type: ADD_PLAYER });
    setSpeaker("mario");
    setPopoverOpen(marioSay);
    await wait(4000);
    // princess laugh
    setPopoverOpen("");
    dispatch({ type: MOVE_LEFT });
    await wait(3000);
  };

  const step4 = async () => {
    setPopoverOpen(boxmarioSay);
    dispatch({
      type: "EXACT_CASE_POSITION",
      payload: { ...casesConstant, type: "left", left: (exactPos as any).left }
    });
    await wait(4000);
    setPopoverOpen("");
    await wait(1000);
    setPopoverOpen(boxmarioJump);
    await wait(2000);
    setPopoverOpen("");
  };

  const step5 = async () => {
    setSpeaker("princess");
    setPopoverOpen(freeRide);
    await wait(6000);
    setPopoverOpen(freeRide2);
    await wait(7000);
    setPopoverOpen("");
    setPopoverOpen("Ready?");
    await wait(4000);
    dispatch({ type: "RESET_GAME" });
  };

  useEffect(() => {
    if (
      player &&
      Object.keys(pangolin).length &&
      player.x <= Object.values(pangolin)[0].x
    ) {
      if (player.position.isRunningLeft) {
        dispatch({ type: MOVE_LEFT, stop: true });
      }
    }
  }, [player, Object.values(pangolin)[0]]);

  const [showCase, setShowCase] = useState(false);
  const [speaker, setSpeaker] = useState("princess");
  const [popoverOpen, setPopoverOpen] = useState("");
  const toggle = () => setPopoverOpen("");
  useEffect(() => {
    (async function() {
      await wait(1000);
      await step1();
      await step2();
      await step3();
      await step4();
    })();
  }, []);

  useEffect(() => {
    (async function() {
      if (player && player.position.isDoctor) {
        await step5();
      }
    })();
  }, [player && player.position.isDoctor]);

  return (
    <>
      {player && <Hero {...player} />}
      {popoverOpen && <Popover
        placement="top-end"
        isOpen={!!popoverOpen}
        target={speaker}
        toggle={toggle}
      >
        <PopoverBody>{popoverOpen}</PopoverBody>
      </Popover>}
      {Object.entries(misc).map(([key, props]) => {
        return (props as any).type === "mask" ? (
          <Mask key={key} {...props} />
        ) : (
          <Mushroom key={key} {...props} />
        );
      })}
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
      <Castle />
      {Object.entries(pangolin).map(([key, props]) => (
        <Pangolin key={key} id={key} {...props} />
      ))}
      <Friends {...peach} />
    </>
  );
};

export default Tutorial;
