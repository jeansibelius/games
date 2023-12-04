type Player = 1 | 2;
type Coordinates = {
    x: number;
    y: number;
};
export interface GameResponse {
    grid: typeof grid;
    nextPlayer: Player;
    msg: string;
}
declare let grid: number[][];
export declare const initGame: () => GameResponse;
export declare const playerMove: (player: Player, { x, y }: Coordinates) => GameResponse;
export {};
