import React, {
  createContext, Dispatch,
  FunctionComponent,
  useContext,
  useEffect,
  useReducer,
  useState
} from "react";
import globalReducer, {
  ActionType,
  ExistingHero,
  initialState,
  State
} from "../reducers/global_reducer";
import playerReducer from "../reducers/player_reducer";
import dinosaurReducer from "../reducers/dinosaur_reducer";

const combineReducer = (
  ...functions: ((state: any, action: ActionType) => State)[]
) => (state: State, action: ActionType) => {
  return functions.reduce((arg, fn) => {
    return fn(arg, action);
  }, state);
};

const UserContext = createContext<any>([] as unknown);

const reducers = combineReducer(globalReducer, playerReducer, dinosaurReducer);

const GameProvider: FunctionComponent = ({ children }) => {
  const [state, setState] = useState({ isLoaded: false });

  const contextValue = useReducer(reducers, initialState);
  useEffect(() => {
    setState({ isLoaded: true });
  }, []);
  return (
    <UserContext.Provider value={contextValue}>
      {state.isLoaded && children}
    </UserContext.Provider>
  );
};

export const useGameData = (): [ExistingHero, Dispatch<ActionType>] => useContext(UserContext);

export { UserContext, GameProvider, reducers };

export default GameProvider;
