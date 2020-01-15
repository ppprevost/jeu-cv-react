import React, { SetStateAction, useEffect, useState } from "react";
import { useFetch } from "../helpers/hooks";
import { useGameData } from "../store/GameProvider";

export const TemplateComments = ({
  email,
  setTypeModal
}: {
  email: string | null;
  setTypeModal: (e: string) => any;
}) => {
  const [sendCommented, setSendCommented] = useState(false);
  const [data, setData] = useState({});
  // @ts-ignore

  const { response: responseCom, error: errorCom, isLoading } = useFetch(
    "/send-comments",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...data, email })
    },
    sendCommented && !!Object.keys(data).length
  );

  useEffect(() => {
    if (sendCommented) {
      console.log(sendCommented);
      const cursor = document.getElementById(
        "form-comments"
      ) as HTMLFormElement;
      setData(Object.fromEntries(new FormData(cursor)));
    }
  }, [sendCommented]);

  const sendComments = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSendCommented(true);
  };
  return (
    <>
      <button onClick={() => setTypeModal("")}>back</button>
      {errorCom && <p>"an error for the comment occured"</p>}
      {responseCom && <p>"Thank you for your comments !"</p>}
      {isLoading && "wait, for sending"}
      {!errorCom && !responseCom && !isLoading && (
        <form onSubmit={sendComments} id="form-comments">
          <div className="form-group">
            <span>How was the game ?</span>
            <div className="radio">
              <label>
                <input
                  name="appreciation"
                  type="radio"
                  value="good"
                  defaultChecked
                />
                Good
              </label>
            </div>
            <div className="radio">
              <label>
                <input name="appreciation" type="radio" value="bad" />
                Bad
              </label>
            </div>
          </div>
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder={"Put your commment"}
              name={"comments"}
            />
          </div>
          <button type={"submit"}>Send Comments</button>
        </form>
      )}
    </>
  );
};

export const TemplateScore = ({
  setTypeModal
}: {
  setTypeModal: SetStateAction<any>;
}) => {
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
