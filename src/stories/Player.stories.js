import React, { createContext, FunctionComponent, useContext, useEffect, useReducer, useState } from "react";
import { storiesOf } from "@storybook/react";
import { withContexts } from "@storybook/addon-contexts/react";
import Hero from "../../src/components/Hero";
import { initHeroes } from "../../src/data/player";
import { UserContext } from '../store/GameProvider';
import {
  withKnobs,
  color,
  boolean,
  text,
  number,
  select
} from "@storybook/addon-knobs";
import { initialState, reducer } from "../store/GameProvider";

const stories = storiesOf("Player", module);

const initState = {...initialState}
const initHeroesMock = {...initHeroes};
initHeroesMock.x = 20;
initHeroesMock.y = 10;
initState.player=initHeroesMock;

const GameProvider = ({ children }) => {
  const [state, setState] = useState({ isLoaded: false });
  // @ts-ignore
  const contextValue = useReducer(reducer, initState);
  useEffect(() => {
    setState({ isLoaded: true });
  }, []);
  return (
    <UserContext.Provider value={contextValue}>
      {state.isLoaded && children}
    </UserContext.Provider>
  );
};


stories.addDecorator(withKnobs).add("idle", () => <GameProvider><Hero {...initHeroesMock}/></GameProvider>);
