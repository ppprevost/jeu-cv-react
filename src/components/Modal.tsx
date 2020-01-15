import React, { FunctionComponent, SetStateAction, useState } from "react";
import styled from "styled-components";
import { useGameData } from "../store/GameProvider";
import { TemplateComments, TemplateScore } from "./Win";

interface ModalProps {
  onVisible: boolean;
  setVisible: (el: false) => any;
  closeModal: boolean;
  fontSize: number | string;
  fontFamily: string;
  overflow: string;
}

type ModalOptional = Partial<ModalProps>;

const ButtonClose = styled.button<any>`
  position: absolute;
  width: 37px;
  margin-left: 44%;
  top: 0;
`;

const ModalImg = styled.div<any>`
  background-color: black;
  color: white;
  letter-spacing: 0.2em;
  font-family: ${({ fontFamily }) =>
    fontFamily ? fontFamily : "Jurassik, sans-serif"};
  font-size: ${({ fontSize }) => fontSize || "30px"};
  position: absolute;
  max-width: 100%;
  width: 600px;
  margin: auto auto;
  border: 1px solid #f7f936;
  overflow: ${({ overflow }) => overflow || "auto"};
  max-height: 291px;
  line-height: 30px;
  text-align: center;
  padding: 2rem;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2000;
`;

export const ModalTemplate: FunctionComponent<ModalOptional> = ({
  children,
  onVisible = true,
  setVisible = () => {},
  closeModal = false,
  ...otherProps
}) => {
  const close = () => {
    if (setVisible) setVisible(false);
  };

  return (
    <div>
      {onVisible && (
        <>
          <ModalImg {...otherProps}>
            {closeModal && <ButtonClose onClick={close}>X</ButtonClose>}
            {children}
          </ModalImg>
        </>
      )}
    </div>
  );
};

export const ModalPause: FunctionComponent<{
  setPauseOff?: SetStateAction<any>;
}> = ({ setPauseOff }) => {
  return (
    <ModalTemplate>
      <div>Pause</div>
      <button onClick={setPauseOff}>Return to Game</button>
    </ModalTemplate>
  );
};

export const ModalGameOver = () => {
  const [, dispatch] = useGameData();

  const reset = () => {
    return dispatch({ type: "RESET_GAME" });
  };

  return (
    <ModalTemplate>
      <div>You die !</div>
      <button onClick={reset}>Try again</button>
    </ModalTemplate>
  );
};

export const ModalWin = () => {
  const [
    {
      player: { email = "undefined email" },
      competency
    }
  ] = useGameData();

  const [typeModal, setTypeModal] = useState("");

  return (
    <ModalTemplate overflow={"scroll"} fontSize={"1rem"} fontFamily={"inherit"}>
      {typeModal === "" && (
        <>
          <p>
            You win, see your score, and listen SKARAH-B new ska Album :) :) :)
          </p>
          <div className="row">
            <button
              className={"col-sm-6"}
              onClick={() => setTypeModal("score")}
            >
              See Best Scores
            </button>
            <button
              className={"col-sm-6"}
              onClick={() => setTypeModal("comments")}
            >
              Add a comments
            </button>
          </div>
          <div className="row">
            <button
              className={"col-sm-6"}
              onClick={() => setTypeModal("competency")}
            >
              See All Competency
            </button>
            <button
              className={"col-sm-6"}
              onClick={() => setTypeModal("music")}
            >
              Listen to Skarahb Music
            </button>
          </div>
        </>
      )}
      {typeModal === "music" && (
        <>
          <button onClick={() => setTypeModal("")}>back</button>
          <div className="mx-auto">
            <iframe
              scrolling="no"
              frameBorder="0"
              allowTransparency={true}
              src="https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=300&height=300&color=ff0000&layout=dark&size=medium&type=album&id=126086342&app_id=1"
              width="300"
              height="300"
            ></iframe>
          </div>
        </>
      )}
      {typeModal === "comments" && (
        <TemplateComments setTypeModal={setTypeModal} email={email} />
      )}
      {typeModal === "competency" && (
        <>
          <button onClick={() => setTypeModal("")}>back</button>
          {competency.map(comp => {
            return (
              <a
                key={comp.type}
                title={comp.type}
                target="_blank"
                rel="noopener noreferrer"
                href={comp.website}
              >
                <img
                  style={{ width: "50px", height: "50px" }}
                  src={comp.avatar}
                  alt={comp.type}
                />
              </a>
            );
          })}
        </>
      )}
      {typeModal === "score" && <TemplateScore setTypeModal={setTypeModal} />}
    </ModalTemplate>
  );
};

export default ModalTemplate;
