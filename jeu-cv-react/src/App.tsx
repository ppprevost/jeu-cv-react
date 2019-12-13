import React, {Component} from 'react';
import './App.css';
import UserProvider from "./store/GameProvider"
import Game from './page/Game';

class Play extends Component {
    render() {
        return (
            <div id="containerGame">
                <Game />
            </div>
        );
    }
}

const App = () => (
    <UserProvider><Play /></UserProvider>

)

export default App;
