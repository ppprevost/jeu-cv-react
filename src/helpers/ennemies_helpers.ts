import { EnemyInit, virusInit, pangInit } from "../data/ennemies";

export const createEnemy = (
  windowSize: number,
  type: string,
  configurePosition?: { direction: 'left'| 'right'; x: number }
): EnemyInit => {
  const chosenEnnemy =
    type === "virus"
      ? ({ ...virusInit } as EnemyInit)
      : ({ ...pangInit } as EnemyInit);
  if (configurePosition) {
    chosenEnnemy.x = configurePosition.x;
    chosenEnnemy.direction = configurePosition.direction;
    chosenEnnemy.avatar =
      configurePosition.direction === "left"
        ? chosenEnnemy.avatar[0]
        : chosenEnnemy.avatar[1];
    return chosenEnnemy;
  }

  const randomPosition = [windowSize, -chosenEnnemy.width][
    Math.round(Math.random())
  ];
  chosenEnnemy.x = chosenEnnemy.avatar.length > 1 ? randomPosition : windowSize;
  chosenEnnemy.avatar =
    randomPosition === windowSize || chosenEnnemy.avatar.length < 2
      ? chosenEnnemy.avatar[0]
      : chosenEnnemy.avatar[1];
  chosenEnnemy.direction = randomPosition === windowSize ? "left" : "right";
  return chosenEnnemy;
};

export const conditionToConflict = (
  positionHero: number,
  refPosition: any,
  width: number,
  playerHeight: number,
  y: number,
  height: number
) => {
  return (
    positionHero >= refPosition.current &&
    positionHero <= refPosition.current + width &&
    y + playerHeight >= y &&
    y <= y + height
  );
};
