import { createPrompt, useState, useKeypress, isEnterKey, isUpKey, isDownKey, KeypressEvent } from "@inquirer/core";
import { Prompt } from "@inquirer/type";

interface Coordinates {
  x: number;
  y: number;
}

interface CoordinatePromptConfig {
  message: string;
  default: string;
  grid: unknown[][];
  updateCoordinatesCallback: (coordinates: Coordinates) => Coordinates;
}

export const coordinatePrompt: Prompt<Coordinates, CoordinatePromptConfig> = createPrompt<
  Coordinates,
  CoordinatePromptConfig
>((config, done) => {
  const parsedCoordinates = JSON.parse(config.default) as Coordinates;
  const [coordinates, setCoordinates] = useState(parsedCoordinates);
  const width = config.grid[0].length - 1;
  const height = config.grid.length - 1;

  useKeypress((key) => {
    if (isEnterKey(key)) {
      const answer = coordinates;
      done(answer);
    } else if (isUpKey(key)) {
      setCoordinates({ ...coordinates, y: coordinates.y === 0 ? height : coordinates.y-- });
    } else if (isDownKey(key)) {
      setCoordinates({ ...coordinates, y: coordinates.y === height ? 0 : coordinates.y++ });
    } else if (isLeftKey(key)) {
      setCoordinates({ ...coordinates, x: coordinates.x === 0 ? width : coordinates.x-- });
    } else if (isRightKey(key)) {
      setCoordinates({ ...coordinates, x: coordinates.x === width ? 0 : coordinates.x++ });
    }
    setCoordinates(config.updateCoordinatesCallback(coordinates));
  });

  return `Place at { x: ${coordinates.x}, y: ${coordinates.y} }`;
});

const isLeftKey = (key: KeypressEvent): boolean =>
  // The left key
  key.name === "left" ||
  // Vim keybinding
  key.name === "h";

const isRightKey = (key: KeypressEvent): boolean =>
  // The right key
  key.name === "right" ||
  // Vim keybinding
  key.name === "l";
