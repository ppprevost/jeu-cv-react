import React, { useRef } from "react";
import { useFetch } from "../helpers/hooks";
import { useGameData } from "../store/GameProvider";

export const TemplateComments = ({
  email,
  setTypeModal
}: {
  email: string | null;
  setTypeModal: (e: string) => any;
}) => {
  const sendCommented = useRef(false);
  // @ts-ignore
  const cursor: HTMLFormElement = document.querySelector("#form-comments");
  const data = Object.fromEntries(new FormData(cursor));
  const { response: responseCom, error: errorCom, isLoading } = useFetch(
    "/send-comments",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: { ...data, email }
    },
    sendCommented.current
  );
  const sendComments = (event: any) => {
    event.preventDefault();
    sendCommented.current = true;
  };
  return (
    <>
      <button onClick={() => setTypeModal("")}>back</button>
      {errorCom && "an error for the comment occured"}
      {responseCom && "Thank you for your comments !"}
      {isLoading && "wait, for sending"}
      {!errorCom && !responseCom && !isLoading && (
        <form onSubmit={sendComments} id="form-comments">
          <div className="form-group">
            <span>How was the game ?</span>
            <div className="radio">
              <label>
                <input name="radio" type="radio" value="Good" defaultChecked />
                Good
              </label>
            </div>
            <div className="radio">
              <label>
                <input name="radio" type="radio" value="Bad" />
                Bad
              </label>
            </div>
          </div>
          <textarea
            className="form-control"
            placeholder={"Put your commment"}
            name={"comments"}
          />
          <button type={"submit"}>Send Comments</button>
        </form>
      )}
    </>
  );
};

export const TemplateScore = ({ setTypeModal }: { setTypeModal: any }) => {
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
    <>
      {isLoading && <span>Waiting score ...</span>}
      {error && <span>{error}</span>}

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
            response.map(({ name, score, chrono, health, dynamite, _id }) => (
              <tr key={_id}>
                <td>{name}</td>
                <td> {score}</td>
                <td>
                  {chrono.minute}:{chrono.second}
                </td>
                <td>{health}</td>
                <td>{dynamite}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};
