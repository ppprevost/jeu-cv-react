import React from 'react';
import background1 from '../img/background/background1.png'
import background2 from '../img/background/background2.png'
import background3 from '../img/background/background3.png'
import background4 from '../img/background/background4.png'
import background5 from '../img/background/background5.png'
import background6 from '../img/background/background6.png'
import background7 from '../img/background/background7.png'

const backgroundImg = [background1, background2, background3, background4, background5, background6, background7]

const style = {
    top: 470,
    width: 90,
    height: 80
}

const Background = ({left}: {left:number}) => {
    const {top, width, height} = style;
    const objetRandom = Math.round(Math.random() * 5) + 1;
    const avatar = backgroundImg[objetRandom];
    return <img className='background' src={avatar} style={{top, width, height,left, position:'absolute'}} />
}

export default Background