import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import {useFetch} from "../helpers/hooks";
import {useGameData} from "../store/GameProvider";

const ModalTemplate = styled.div`
    background-color: black;
    color: white;
    letter-spacing: 0.2em;
    font-family: Jurassik, sans-serif;
    font-size: 40px;
    position: absolute;
    max-width: 100%;
    width: 600px;
    left: 50%;
    line-height: 40px;
    text-align: center;
    padding: 50px;
    margin-left: -300px;
    top: 250px;
    z-index: 2000;
`

export const ModalPause = ()=> {


    return <ModalTemplate>
        <div>Pause</div>
    </ModalTemplate>
}

export const ModalWin = () => {
    const {response, error, isLoading} = useFetch<{username:string,score:number, _id:string}[]>('/best-scores', {request:{username:'tata', score:34}})
    return (<ModalTemplate>
        {isLoading && <span>Waiting score ...</span>}
        {error && <span>{error}</span>}
        {response && response.map(({username,score, _id}) =><div
        key={_id}
        >{username} {score}</div>)}

    </ModalTemplate>)

}

export default ModalTemplate