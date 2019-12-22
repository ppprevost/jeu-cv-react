import React, {FunctionComponent} from 'react';
import styled from 'styled-components';
import {rotate} from "../helpers/styled";

export interface Competency {
    avatar: string
    type: string
    website:string
    catched?: boolean
    x: number,
    y: number
}

const ImgCompetency = styled.img<Competency>`
animation: ${rotate} 2s linear infinite;
z-index: 1000;
position:absolute;
top:${({y}) => y + 'px'};
width:50px;
height:50px;
left:${({x}) => x + 'px'}
`

const CompetencyGenerator: FunctionComponent<Competency> = (props) => {
    return <ImgCompetency src={props.avatar}
                          alt="competency-image"
                          {...props}

    />
}


export default CompetencyGenerator