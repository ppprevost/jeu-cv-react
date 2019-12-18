import React, {useMemo} from 'react';
import './App.css';
import UserProvider, {useGameData} from "./store/GameProvider"
import Game from './page/Game';
import MainHeader from "./components/MainHeader";

const MainHeaderMemoized = () => {
    return useMemo(() => <MainHeader />, [])
}

const Play = () => {
    const [{player}] = useGameData()
    return (
        <div id="containerGame">
            {player && MainHeaderMemoized()}
            <Game />
        </div>
    );
}

const App = () => (
    <UserProvider><Play /></UserProvider>

)

export default App;
