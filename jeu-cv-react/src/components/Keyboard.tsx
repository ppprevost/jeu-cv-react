import React from 'react';
import keyboardArrow from '../img/arrow-key.png';
import styled from 'styled-components';
import keyboard from '../img/keyboard.png'

const ContainerArrow = styled.div`
position: absolute;
left:10%;
width: 100px;
font-size:2rem;
text-align: center;
font-family: Jurassik, sans-serif;
`

const ContainerKeyboard = styled.div`
position: absolute;
left:80%;
margin:0;
width: 100px;
font-size:2rem;
text-align: center;
font-family: Jurassik, sans-serif;
`

const KeyboardArrow = styled.img`
width: 100%;
opacity:0.3;
`

const PKey = styled.img<any>`
  width: 43px;
background: ${({bgd}) => 'url(' + bgd + ') 0 0'};

`


const Keyboard = () => {
    return (
        <>
            <ContainerKeyboard>
                <p className="no-margin">P - Pause</p>
                <p className="no-margin">D - Dynamite</p>
                <p className="no-margin">Space - Shoot</p>
            </ContainerKeyboard>
            <ContainerArrow className="keyboard arrow">
                <p>Use Arrow</p>
                <KeyboardArrow src={keyboardArrow} alt="keyboardArrow" />
            </ContainerArrow>
        </>
    )
}


export default Keyboard