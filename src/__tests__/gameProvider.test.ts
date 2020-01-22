import { initialState, reducer } from "../store/GameProvider";
import { initHeroes } from "../data/player";
import { ADD_DINO, ADD_PLAYER, RESET_GAME } from "../constants";
import { createDinosaur } from "../helpers/ennemies_helpers";

describe("Game Store", () => {
  let stateWithHero = { ...initialState, player: { ...initHeroes } };
  it("should start the Game", () => {
    const data = { name: "coco", email: "rr@ee.fr" };
    const action = {
      type: "START_GAME",
      payload: data
    };
    expect(reducer(JSON.parse(JSON.stringify(stateWithHero)), action)).toEqual({
      ...stateWithHero,
      intro: false,
      gameType: "game",
      player: { ...stateWithHero.player, email: data.email, name: data.name }
    });
  });
  it("should add a Dino", () => {
    const newDino = createDinosaur(700);
    const action = { type: ADD_DINO, newDino };
    const reducerHook = reducer({ ...stateWithHero }, action);
    // TODO add speed in the createDinosaur method
    const speed = reducerHook.dino[0].speed;
    expect(reducerHook).toEqual({
      ...stateWithHero,
        idDino:1,
      dino: [{ ...newDino, alive: true, id: 1, speed }]
    });
  });
  it("should reset the game", () => {
    const action = {
      type: RESET_GAME
    };
    expect(reducer(stateWithHero, action)).toStrictEqual({
      ...stateWithHero,
      intro: false,
      gameType: "game"
    });
  });
});
