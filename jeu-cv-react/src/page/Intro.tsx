import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import hunter from "../img/intro/hunter.png";
import raptor from "../img/intro/raptor.png";
import raptor2 from "../img/intro/raptor2.png";
import pachy from "../img/intro/pachy.png";
import diplo from "../img/intro/diplo.png";
import ptero from "../img/intro/ptero.png";
import logo from "../img/intro/logo.png";

import ModalTemplate from "../components/Modal";

import sonIntro from "../sound/trex_cri.mp3";
import styled from "styled-components";
import { windowSize } from "../constants/contants";
import { useGameData } from "../store/GameProvider";

const introSound = new Audio(sonIntro);

const LOGOComponent = styled.img`
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
`;

const Hunter = styled.img`
position:absolute;
left:${windowSize * 0.01 + "px"}
top: 150px;
width:350px

`;

interface DinoPropsIntro {
  name: string;
  position: number;
  zIndex: number;
  top: number;
}

const Dino = styled.img<DinoPropsIntro>`
position:absolute;
z-index:${({ zIndex }) => zIndex} ;
left:${({ position }) => windowSize * position + "px"}
top:${({ top }) => 200 + top + "px"};
`;

const dinoTab = [
  { name: "ptero", src: ptero, position: 0.75, zIndex: 12, top: -100 },
  {
    name: "raptor",
    src: raptor,
    top: 0,
    position: 0.7,
    zIndex: 12
  },
  {
    name: "diplo",
    src: diplo,
    top: 100,
    position: 0.65,
    zIndex: 12
  }
];

const Intro = () => {
  const [seeVideo, setSeeVideo] = useState(false);
  const [seeModalName, setSeeModalName] = useState(false);
  const launchNameModal = () => {
    setSeeModalName(true);
  };
  const seeVideoTuto = () => {
    setSeeVideo(!seeVideo);
  };

  console.log("launch");
  useLayoutEffect(() => {
    //son T rex
    introSound.currentTime = 0;
    introSound.play();
    introSound.volume = 0.7;
  }, []);
  return (
    <div className="intro-game">
      <LOGOComponent src={logo} />
      {seeVideo && <ModalVideo />}
      {seeModalName && <ModalPreGame />}
      {!seeModalName && (
        <>
          <Hunter src={hunter} className="perso-hunter" />
          {dinoTab.map(props => (
            <Dino key={props.name} {...props} />
          ))}
          <div className="how-to-play" onClick={seeVideoTuto}>
            How to play
          </div>
          <div className="explanations"></div>
          <div className="launch" onClick={launchNameModal}>
            Start the Game !
          </div>
        </>
      )}
    </div>
  );
};

export const ModalVideo = () => {
  return (
    <ModalTemplate>
      <p>Use 'up', 'down','left', 'right' key</p>
      <p>D for Dynamite, Space for shooting, P for pause</p>
      <iframe
        width="420"
        height="300"
        src="https://www.youtube.com/embed/NNZ5XWnEgvA"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </ModalTemplate>
  );
};

export const ModalPreGame = () => {
  const [, dispatch] = useGameData();
  const [form, setForm] = useState({});
  const startParty = (e: any) => {
    e.preventDefault();
    dispatch({ type: "START_GAME", payload: form });
    introSound.pause();
  };
  const handleChange = (e: any) => {
    const name = e.target.name;
    setForm({ ...form, [name]: e.target.value });
  };

  return (
    <ModalTemplate fontFamily={"none"}>
      <h2 style={{ letterSpacing: 0 }}>Who are you young adventurer ?</h2>
      <form onSubmit={startParty}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            required
            name="name"
            onChange={handleChange}
            placeholder="your name"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            required
            name="email"
            onChange={handleChange}
            placeholder="your email"
          />
        </div>
        <div>
          <button type="submit">Send</button>
        </div>
      </form>
    </ModalTemplate>
  );
};

export default Intro;
