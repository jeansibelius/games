type Player = 1 | 2;
type Coordinates = {
    x: number;
    y: number;
};
export declare const playerMove: (player: Player, { x, y }: Coordinates) => string | {
    grid: number[][];
    player: Player;
} | undefined;
export {};
