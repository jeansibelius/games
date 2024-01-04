type Player = 1 | 2;
type Coordinates = {
    x: number;
    y: number;
};
export interface GameResponse {
    grid: typeof grid;
    nextPlayer: Player;
    nextPossibleMoves: Coordinates[];
    msg: string;
}
declare let grid: number[][];
export declare const initGame: (initGrid?: number[][]) => GameResponse;
export declare const playerMove: (player: Player, move: Coordinates) => GameResponse;
export {};
