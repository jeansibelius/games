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
export declare const coordinatePrompt: Prompt<Coordinates, CoordinatePromptConfig>;
export {};
