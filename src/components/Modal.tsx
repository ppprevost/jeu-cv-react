import React, { FunctionComponent, SetStateAction, useState } from "react";
import styled from "styled-components";
import { useFetch } from "../helpers/hooks";
import { useGameData } from "../store/GameProvider";

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
  line-height: 40px;
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

export const SkarahbModal = () => {
  return (
    <iframe
      scrolling="no"
      frameBorder="0"
      allowTransparency={true}
      src="https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=300&height=300&color=ff0000&layout=dark&size=medium&type=album&id=126086342&app_id=1"
      width="300"
      height="300"
    ></iframe>
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
      player: {
        score,
        name = "undefined player",
        email = "undefined email",
        dynamite,
        health
      },
      chrono,
      competency
    }
  ] = useGameData();

  const sendComments = (e: any, _id: string) => {
    e.preventDefault();
  };
  const { response: resComment, error: errorComment } = useFetch<{
    comments: string;
    likes: boolean;
    _id: string;
  }>("/send-comments", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  const { response, error, isLoading } = useFetch<
    {
      name: string;
      score: number;
      chrono: { minute: number; second: number };
      health: number;
      dynamite: number;
      _id: string;
    }[]
  >("/send-scores", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      score,
      email,
      health,
      dynamite,
      chrono
    })
  });
  const [typeModal, setTypeModal] = useState("");
  return (
    <ModalTemplate overflow={"scroll"} fontSize={"1rem"} fontFamily={"none"}>
      {typeModal === "" && (
        <>
          <p>
            You win, see your score, and listen SKARAH-B new ska Album :) :) :)
          </p>
          <button onClick={() => setTypeModal("score")}>See Best Scores</button>
          <button onClick={() => setTypeModal("comments")}>Comments</button>
          <button onClick={() => setTypeModal("competency")}>
            See All Competency
          </button>
          <button onClick={() => setTypeModal("music")}>
            Listen to Skarahb Music
          </button>
        </>
      )}
      {typeModal === "music" && (
        <>
          <button onClick={() => setTypeModal("")}>back</button>
          <iframe
            scrolling="no"
            frameBorder="0"
            allowTransparency={true}
            src="https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=300&height=300&color=ff0000&layout=dark&size=medium&type=album&id=126086342&app_id=1"
            width="300"
            height="300"
          ></iframe>
        </>
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
      {isLoading && <span>Waiting score ...</span>}
      {error && <span>{error}</span>}
      {response && typeModal === "score" && (
        <>
          <button onClick={() => setTypeModal("")}>back</button>
          <h2>You survive ! See all survivor :</h2>
          <table>
            <thead>
              <tr>
                <th>name</th>
                <th>score</th>
                <th>chrono</th>
                <th>health</th>
                <th>dynamite</th>
              </tr>
            </thead>
            <tbody>
              {response &&
                response.map(
                  ({ name, score, chrono, health, dynamite, _id }) => (
                    <tr key={_id}>
                      <td>{name}</td>
                      <td> {score}</td>
                      <td>
                        {chrono.minute}:{chrono.second}
                      </td>
                      <td>{health}</td>
                      <td>{dynamite}</td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </>
      )}
    </ModalTemplate>
  );
};

export default ModalTemplate;
