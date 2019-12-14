import React, {useState} from 'react';
import {useGameData} from "../store/GameProvider";

type IPropsHeader = {
    dynamite:number,
    health:number,
    score:number
}

const MainHeader = ({dynamite, health, score}: IPropsHeader) => {
    const [data, dispatch] = useGameData()
    const setSound = ()=>dispatch({type: 'SET_SOUND'});
    return (<div className="container">
        <div className="row tableau misc">
            <div className="col-xs-3 text-center">
                <div className="glyphicon glyphicon-time" aria-hidden="true"></div>
                <span>Surviving Time</span>
                <div id="compteur">
                    <div className="nextskill"></div>
                </div>
            </div>
            <div className="col-xs-3 text-center">
                <div className="glyphicon glyphicon-heart"></div>
                <span>Health</span>
                <div id="health">{health}</div>
            </div>
            <div className="col-xs-3 text-center">
                <div className="glyphicon glyphicon-flash"></div>
                <span>Dynamite</span>
                <div id="supply">{dynamite}</div>
            </div>


            <div className="col-xs-3 text-center">
                <div className="glyphicon glyphicon-usd"></div>
                <span>Score </span>
                <div id="score">{score}</div>
            </div>
        </div>

        <div className="row sub-menu misc">
            <div className="cv col-xs-4">
                <a href="document/cv_ppprevost_ifocop.pdf" target="_blank">Download My CV</a>
            </div>
            <div className="startAgain col-xs-4">
                Start Again
            </div>
            <div className="col-xs-4 sound" onClick={setSound}>
                Sound {data.sound ? 'on' : 'off'}
            </div>
        </div>
    </div>)

}

export default MainHeader;