import React, {FunctionComponent} from 'react';
import styled from 'styled-components';
import {rotate} from "../helpers/styled";
import {heightCompetency, widthCompetency} from "../constants/contants";

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
bottom:${({y}) => y + 'px'};
width:${widthCompetency + 'px'};
height:${heightCompetency + 'px'};
left:${({x}) => x + 'px'}
`

const CompetencyGenerator: FunctionComponent<Competency> = (props) => {
    return <ImgCompetency src={props.avatar}
                          alt="competency-image"
                          {...props}

    />
}


export default CompetencyGenerator