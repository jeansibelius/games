import { createPrompt, useState, useKeypress, isEnterKey, isUpKey, isDownKey } from "@inquirer/core";
export const coordinatePrompt = createPrompt((config, done) => {
    const parsedCoordinates = JSON.parse(config.default);
    const [coordinates, setCoordinates] = useState(parsedCoordinates);
    const width = config.grid[0].length - 1;
    const height = config.grid.length - 1;
    useKeypress((key) => {
        if (isEnterKey(key)) {
            const answer = coordinates;
            done(answer);
        }
        else if (isUpKey(key)) {
            setCoordinates({ ...coordinates, y: coordinates.y === 0 ? height : coordinates.y-- });
        }
        else if (isDownKey(key)) {
            setCoordinates({ ...coordinates, y: coordinates.y === height ? 0 : coordinates.y++ });
        }
        else if (isLeftKey(key)) {
            setCoordinates({ ...coordinates, x: coordinates.x === 0 ? width : coordinates.x-- });
        }
        else if (isRightKey(key)) {
            setCoordinates({ ...coordinates, x: coordinates.x === width ? 0 : coordinates.x++ });
        }
        setCoordinates(config.updateCoordinatesCallback(coordinates));
    });
    return `Place at { x: ${coordinates.x}, y: ${coordinates.y} }`;
});
const isLeftKey = (key) => 
// The left key
key.name === "left" ||
    // Vim keybinding
    key.name === "h";
const isRightKey = (key) => 
// The right key
key.name === "right" ||
    // Vim keybinding
    key.name === "l";
