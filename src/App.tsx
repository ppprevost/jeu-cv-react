import React, {useMemo, lazy, Suspense} from 'react';
import './App.css';
import GameProvider, {useGameData} from "./store/GameProvider"
import Intro from "./page/Intro"
import MainHeader from "./components/MainHeader";
const Game = lazy(()=>import('./page/Game'))

const MainHeaderMemoized = () => {
    return useMemo(() => <MainHeader />, [])
}
const App = () => (
    <GameProvider><Play /></GameProvider>
)
const Play = () => {
    const [{player, gameType, intro}] = useGameData()
    return (
        <div id="containerGame">
            {player && <MainHeaderMemoized />}
            {intro && <Intro />}
            {gameType==="game" && <Suspense fallback={'is loading'}><Game /></Suspense>}
        </div>
    );
}

export default App;
