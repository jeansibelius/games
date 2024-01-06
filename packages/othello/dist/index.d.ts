type Player = 1 | 2;
type Coordinates = {
    x: number;
    y: number;
};
export interface GameResponse {
    grid: typeof grid;
    gameOver: typeof gameOver;
    nextPlayer: typeof nextPlayer;
    nextPossibleMoves: typeof nextPossibleMoves;
    points: typeof points;
    msg: string;
}
declare let grid: number[][];
declare let gameOver: boolean;
declare let nextPlayer: Player;
declare let nextPossibleMoves: Coordinates[];
declare let points: Record<Player, number>;
export declare const initGame: (initGrid?: number[][]) => GameResponse;
export declare const playerMove: (player: Player, move: Coordinates) => GameResponse;
export {};
