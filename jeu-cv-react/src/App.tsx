import React, {useMemo} from 'react';
import './App.css';
import GameProvider, {useGameData} from "./store/GameProvider"
import Game from './page/Game';
import MainHeader from "./components/MainHeader";

import favorite from "./reducers/player_reducer";

const MainHeaderMemoized = () => {
    return useMemo(() => <MainHeader />, [])
}

const App = () => (
    <GameProvider><Play /></GameProvider>

)

const Play = () => {
    const [{player}] = useGameData()
    return (
        <div id="containerGame">
            {player && MainHeaderMemoized()}
            <Game />
        </div>
    );
}

export default App;
