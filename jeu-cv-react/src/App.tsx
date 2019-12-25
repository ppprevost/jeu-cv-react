import React, {useMemo} from 'react';
import './App.css';
import GameProvider, {useGameData} from "./store/GameProvider"
import Game from './page/Game';
import MainHeader from "./components/MainHeader";

import favorite from "./reducers/player_reducer";
import {ModalPreGame} from "./components/Modal";

const MainHeaderMemoized = () => {
    return useMemo(() => <MainHeader />, [])
}

const App = () => (
    <GameProvider><Play /></GameProvider>

)

const Play = () => {
    const [{player, gameType}] = useGameData()
    return (
        <div id="containerGame">
            {player && MainHeaderMemoized()}
            {!gameType && <ModalPreGame/>}
            {gameType==="game" && <Game />}
        </div>
    );
}

export default App;
