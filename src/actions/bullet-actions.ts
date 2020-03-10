import { useGameData } from "../store/GameProvider";
import { IPropsDino } from "../components/Dinosaurs";

export const useBulletActions = () => {
  const [, dispatch] = useGameData();
  const stopBullet = (type: string, id: number) => {
    dispatch({ type: "STOP_BULLET", payload: { type, id } });
  };
  const killDino = (dino: IPropsDino) => {
    dispatch({ type: "KILL_DINO", payload: { id: dino.id } });
  };
  const rampage = () => {
    dispatch({ type: "RAMPAGE" });
  };
  return {stopBullet, killDino, rampage}
};
