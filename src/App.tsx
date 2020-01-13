import React, {useMemo, lazy, Suspense, CSSProperties, useEffect} from "react";
import "./App.css";
import background from "./img/fond.png";
import GameProvider, { useGameData } from "./store/GameProvider";
import Intro from "./page/Intro";
import MainHeader from "./components/MainHeader";
import { useWindowSize } from "./helpers/hooks";
const Game = lazy(() => import("./page/Game"));

const skarahb = "https://e-cdns-images.dzcdn.net/images/cover/758113bb674a43d1a87a93eb89c16b5e/298x298-000000-100-1-1.jpg";

export const MainHeaderMemoized = () => {
  return useMemo(() => <MainHeader />, []);
};
const App = () => (
  <GameProvider>
    <Play />
  </GameProvider>
);

const Play = () => {
  const { windowHeight } = useWindowSize();
  const [{win}] = useGameData()
  const style: CSSProperties = {
    background: `url("${win? skarahb : background}")repeat`,
    overflow: "hidden",
    width: 100 + "%",
    margin: "0 auto",
    maxHeight: 580 + "px",
    position: "relative",
    maxWidth: 1400 + "px"
  };

  useEffect(()=>{
    let deferredPrompt:any;
    const addBtn = document.querySelector('.add-button');
    // @ts-ignore
    addBtn.style.display = 'none';
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI to notify the user they can add to home screen
      // @ts-ignore
      addBtn.style.display = 'block';

      // @ts-ignore
      addBtn.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        // @ts-ignore
        addBtn.style.display = 'none';
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult:any) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
      });
    });


  })

  const [{ gameType, intro }] = useGameData();
  return (
    <div style={{ ...style, height: windowHeight + "px" }}>
      <button className="add-button">Add to home screen</button>
      {intro && <Intro />}
      {gameType === "game" && (
        <Suspense fallback={"is loading"}>
          <Game />
        </Suspense>
      )}
    </div>
  );
};

export default App;
