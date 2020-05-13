import React, {useRef, useState} from "react";
import mario from "../img/intro/M1.png";
import bowser from "../img/intro/bowser.png";
import pangolin from "../img/intro/pangolin-afraid.png";
import virus from "../img/virus.png";
import logo from "../img/intro/logo-drmario.png";
import princess from "../img/intro/princess-intro.png";
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
    z-index:1;
  width:${({ width }) => width + 'px'};
  left: ${({ windowSize }) => {
  return windowSize < 580 ? -150 + "px" : 0 + "px";
}};
  top: ${({ windowHeight }) =>
    (windowHeight < 580 ? windowHeight / 2 - 150 : 150) + "px"};
  width: 150px;
`;

const Princess = styled.img<WindowSizeProps>`
  position: absolute;
  z-index:0;
  left: ${({ windowSize }) => {
  return windowSize < 580 ? -150 + "px" : 30 + "px";
}};
  top: ${({ windowHeight }) =>
    (windowHeight < 580 ? windowHeight / 2 - 150 : 150-80) + "px"};
  width: 200px;
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
  { name: "bowser", src: bowser, position: 0.65, zIndex: 11, top: -100,width:300 },
  { name: "pangolin", src: pangolin, position: 0.80, zIndex: 13, top: 100, width:200 },
  {
    name: "virus",
    src: virus,
    top: 30,
    position: 0.80,
    zIndex: 12
  },
];

export const BigButton = styled.button`
  width: 300px;
  height: auto;
  text-align: center;
  font-family: Mario, sans-serif;
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
`;

const Intro = () => {
  const { windowSize, windowHeight, landscape } = useWindowSize();
  const [seeVideo, setSeeVideo] = useState(false);
  const [seeModalName, setSeeModalName] = useState(false);
  const launchNameModal = () => {
    setSeeModalName(true);
  };

  return (
    <div className="intro-game">
      <ContainerIntro className={"vertical-center"}>
        <LOGOComponent src={logo} />
        {!landscape ? (
          <p style={{ textAlign: "center" }}>Please return your device</p>
        ) : (
          <>
            <BigButton className="launch" onClick={launchNameModal}>
              Start the Game !
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
            src={mario}
            className="perso-hunter"
          />
          <Princess
              windowSize={windowSize}
              windowHeight={windowHeight}
            src={princess}
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
  const formRef = useRef<any>(null);
  const [, dispatch] = useGameData();
  const [form, setForm] = useState({});
  const [tutoWanted, setTutoWanted] = useState(true);
  const startParty = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log()

    dispatch({ type: "START_GAME", payload: form });
    introSound.pause();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    if(name==="tutorial"){
      setTutoWanted(!tutoWanted)
      console.log(name, tutoWanted)
    }

console.log(name, tutoWanted)
    setForm({ ...form, [name]: name==="tutorial"? tutoWanted:e.target.value });
  };

  return (
    <ModalTemplate fontFamily={"inherit"}>
      <h2 style={{ letterSpacing: 0 }}>Please enter your name</h2>
      <form ref={formRef} onSubmit={startParty}>
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
          tutorial
          <input value={'tuto'} name="tutorial" onChange={handleChange} checked={tutoWanted} type="checkbox" />
        </div>
        <div>
          <button type="submit">Send</button>
        </div>
      </form>
    </ModalTemplate>
  );
};

export default Intro;
