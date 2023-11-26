type Player = 1 | 2;
type Coordinates = {
    x: number;
    y: number;
};
export declare const initGame: () => {
    grid: number[][];
    previousPlayer: number;
    msg: string;
};
export declare const playerMove: (player: Player, { x, y }: Coordinates) => {
    grid: number[][];
    previousPlayer: Player;
    msg: string;
} | undefined;
export {};
