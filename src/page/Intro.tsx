import React, { useState, useLayoutEffect, useEffect } from "react";
import hunter from "../img/intro/hunter.png";
import raptor from "../img/intro/raptor.png";
import pachy from "../img/intro/pachy.png";
import diplo from "../img/intro/diplo.png";
import ptero from "../img/intro/ptero.png";
import logo from "../img/intro/logo.png";

import ModalTemplate from "../components/Modal";

import sonIntro from "../sound/trex_cri.mp3";
import styled from "styled-components";
import { useGameData } from "../store/GameProvider";
import { useWindowSize } from "../helpers/hooks";

const introSound = new Audio(sonIntro);

const LOGOComponent = styled.img`
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 300px;
`;

interface WindowSizeProps {
  windowSize: number;
  windowHeight: number;
}

const Hunter = styled.img<WindowSizeProps>`
  position: absolute;
  left: ${({ windowSize }) => {
    return windowSize < 580 ? -150 + "px" : 0 + "px";
  }};
  top: ${({ windowHeight }) =>
    (windowHeight < 580 ? windowHeight / 2 - 150 : 150) + "px"};
  width: 350px;
`;

interface DinoPropsIntro {
  name: string;
  position: number;
  zIndex: number;
  top: number;
  windowSize: number;
}

const Dino = styled.img<DinoPropsIntro>`
  position: absolute;
  z-index: ${({ zIndex }) => zIndex};
  left: ${({ position, windowSize }) => windowSize * position + "px"};
  top: ${({ top }) => 200 + top + "px"};
`;

const dinoTab = [
  { name: "pachy", src: pachy, position: 0.75, zIndex: 12, top: -100 },
  { name: "ptero", src: ptero, position: 0.75, zIndex: 12, top: -200 },
  {
    name: "raptor",
    src: raptor,
    top: 0,
    position: 0.7,
    zIndex: 11
  },
  {
    name: "diplo",
    src: diplo,
    top: 100,
    position: 0.65,
    zIndex: 10
  }
];

export const BigButton = styled.button`
  width: 300px;
  height: auto;
  text-align: center;
  font-family: Jurassik, sans-serif;
  width: 300px;
  height: auto;
  text-align: center;
  font-size: 45px;
  cursor: pointer;
  margin: 0 auto;
  color: white;
  background-color: black;
  border: 1px solid #f7f936;
`;

export const ContainerIntro = styled.div`
  margin: 0 auto;
  width: 300px;
  & > * {
    margin-bottom: 10px;
  }
`;

const Intro = () => {
  const { windowSize, windowHeight, landscape } = useWindowSize();
  const [seeVideo, setSeeVideo] = useState(false);
  const [seeModalName, setSeeModalName] = useState(false);
  const launchNameModal = () => {
    setSeeModalName(true);
  };
  const seeVideoTuto = () => {
    setSeeVideo(!seeVideo);
  };

  useLayoutEffect(() => {
    //son T rex
    introSound.currentTime = 0;
    introSound.play();
    introSound.volume = 0.7;
  }, []);
  return (
    <div className="intro-game">
      <ContainerIntro>
        <LOGOComponent src={logo} />
        {!landscape ? (
          <p style={{ textAlign: "center" }}>Please return your device</p>
        ) : (
          <>
            <BigButton className="launch" onClick={launchNameModal}>
              Start the Game !
            </BigButton>
            <BigButton className="how-to-play" onClick={seeVideoTuto}>
              How to play
            </BigButton>
          </>
        )}
      </ContainerIntro>
      {seeVideo && (
        <ModalVideo closeModal onVisible={seeVideo} setVisible={setSeeVideo} />
      )}
      {seeModalName && <ModalPreGame />}
      {!seeModalName && (
        <>
          <Hunter
            windowSize={windowSize}
            windowHeight={windowHeight}
            src={hunter}
            className="perso-hunter"
          />
          {dinoTab.map(props => (
            <Dino windowSize={windowSize} key={props.name} {...props} />
          ))}
        </>
      )}
    </div>
  );
};

export const ModalVideo = ({ ...props }) => {
  return (
    <ModalTemplate {...props}>
      <h3>Destkop version</h3>
      <p>Use 'up', 'down','left', 'right' key</p>
      <p>D for Dynamite, Space for shooting, P for pause</p>
      <h3>Use tactile Touch Button for mobile</h3>
      <iframe
        title="skarahb"
        width="420"
        height="300"
        src="https://www.youtube.com/embed/NNZ5XWnEgvA"
        frameBorder="0"
        allowFullScreen
      />
    </ModalTemplate>
  );
};

export const ModalPreGame = () => {
  const [, dispatch] = useGameData();
  const [tutoWanted, setTutoWanted] = useState(false);
  const [form, setForm] = useState({
    tutorial: tutoWanted,
    name: ""
  });
  const startParty = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "START_GAME", payload: form });
    introSound.pause();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "tutorial") {
      setTutoWanted(!tutoWanted);
    }
    const name = e.target.name;
    setForm({
      ...form,
      [name]: name === "tutorial" ? !tutoWanted : e.target.value
    });
  };

  // @ts-ignore
  return (
    <ModalTemplate fontFamily={"inherit"}>
      <h2 style={{ letterSpacing: 0 }}>Who are you young adventurer ?</h2>
      <form onSubmit={startParty}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            required
            name="name"
            onChange={handleChange}
            placeholder="your name*"
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              name="tutorial"
              onChange={handleChange}
              checked={tutoWanted}
              type="checkbox"
            />
            <span style={{ marginLeft: "10px" }}>tutorial</span>
          </label>
        </div>
        <div>
          <button type="submit">Send</button>
        </div>
      </form>
    </ModalTemplate>
  );
};

export default Intro;
