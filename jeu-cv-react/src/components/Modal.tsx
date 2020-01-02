import React, { FunctionComponent, SetStateAction } from "react";
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
    border:1px solid #F7F936;
    overflow:${({ overflow }) => overflow || "auto"}
    left: 50%;
    max-height:291px;
    line-height: 40px;
    text-align: center;
    padding: 2rem;
    margin-left: -300px;
    top: 246px;
    z-index: 2000;
`;

export const ModalTemplate: FunctionComponent<ModalOptional> = ({
  children,
  onVisible =true,
  setVisible =()=>{},
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

export const ModalPause = () => {
  return (
    <ModalTemplate>
      <div>Pause</div>
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
      chrono
    }
  ] = useGameData();
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
  return (
    <ModalTemplate overflow={"scroll"} fontSize={"1rem"} fontFamily={"none"}>
      {isLoading && <span>Waiting score ...</span>}
      {error && <span>{error}</span>}
      {response && (
        <>
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
