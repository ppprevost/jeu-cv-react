import React from "react";
import styled from "styled-components";
import castle from "../img/castle.png";

const Castle = styled.img`
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 25vw;
  bottom: 16px;
`;


export default ()=> <Castle src={castle} />