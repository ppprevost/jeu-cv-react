import React, {useState, useEffect, ReactEventHandler} from 'react';
import styled from 'styled-components'
import {useFetch} from "../helpers/hooks";
import {useGameData} from "../store/GameProvider";
import {placeholder} from "@babel/types";

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

export const ModalPause = () => {
    return <ModalTemplate>
        <div>Pause</div>
    </ModalTemplate>
}

export const ModalPreGame = () => {
    const [, dispatch] = useGameData();
    const startParty = (e: any) => {
        e.preventDefault()
        console.log(e.target.value)
        dispatch({type: 'START_GAME', payload: {name: e.target.value.name, email: e.target.value.email}})
    }

    return (<ModalTemplate>
            <h2>Please answer to the question</h2>
            <form onSubmit={startParty}>
                <input type="text" name="name" placeholder="your name" />
                <input type="email" name="email" placeholder="your email" />
                <button type="submit">Send</button>
            </form>
        </ModalTemplate>
    )
}

export const ModalGameOver = () => {
    const [, dispatch] = useGameData();

    const reset = () => {
        return dispatch({type: 'RESET_GAME'})
    }

    return <ModalTemplate>
        <div>You die !</div>
        <button onClick={reset}>Try again</button>
    </ModalTemplate>
}

export const ModalWin = () => {
    const {response, error, isLoading} = useFetch<{ username: string, score: number, _id: string }[]>('/best-scores', {
        request: {
            username: 'tata',
            score: 34
        }
    })
    console.log(error)
    return (<ModalTemplate>
        {isLoading && <span>Waiting score ...</span>}
        {error && <span>{error}</span>}
        {response && response.map(({username, score, _id}) => <div
            key={_id}
        >{username} {score}</div>)}

    </ModalTemplate>)

}

export default ModalTemplate