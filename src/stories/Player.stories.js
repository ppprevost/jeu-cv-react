import React, { createContext, useEffect, useReducer, useState } from "react";
import { storiesOf } from "@storybook/react";
import { withContexts } from "@storybook/addon-contexts/react";
import {Hero} from "../../src/components/Hero";
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
import { initialState } from "../store/GameProvider";
import playerReducers from "../reducers/player_reducer";

const stories = storiesOf("Player", module);

const initState = {...initialState}
const initHeroesMock = {...initHeroes};
initHeroesMock.x = window.innerWidth/2;
initHeroesMock.y = window.innerHeight/2;
initState.player=initHeroesMock;

const GameProviderStories = ({ children }) => {
  const [state, setState] = useState({ isLoaded: false });
  const contextValue = useReducer(playerReducers, initState);
  useEffect(() => {
    setState({ isLoaded: true });
  }, []);
  return (
    <UserContext.Provider value={contextValue}>
      {state.isLoaded && children}
    </UserContext.Provider>
  );
};

stories.addDecorator(withKnobs).add("idle", () => <GameProviderStories><Hero {...initHeroesMock}/></GameProviderStories>);
