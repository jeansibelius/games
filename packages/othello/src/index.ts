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

const initGrid = () => [
  // x 0, 1, 2, 3, 4, 5, 6, 7
  [0, 0, 0, 0, 0, 0, 0, 0], // y 0
  [0, 0, 0, 0, 0, 0, 0, 0], // y 1
  [0, 0, 0, 0, 0, 0, 0, 0], // y 2
  [0, 0, 0, 1, 2, 0, 0, 0], // y 3
  [0, 0, 0, 2, 1, 0, 0, 0], // y 4
  [0, 0, 0, 0, 0, 0, 0, 0], // y 5
  [0, 0, 0, 0, 0, 0, 0, 0], // y 6
  [0, 0, 0, 0, 0, 0, 0, 0], // y 7
];

// Game state
let grid: number[][];
let nextPlayer: Player = 1;

export const initGame = (): GameResponse => {
  grid = initGrid();
  return createResponse("Waiting for the first move.");
};

export const playerMove = (player: Player, { x, y }: Coordinates): GameResponse => {
  try {
    setMoveToGrid(player, { x, y });
    // TODO flip values around latest move
    // 1. If own "color", return false
    // 2. Continue moving in "same" direction
    // 3. If own color, return true
    // 4. If true, flip value to current player

    // TODO find, if there are available moves for next player
    // If not, next player is current
    nextPlayer = player === 1 ? 2 : 1;
  } catch (e) {
    if (e instanceof Error) return createResponse(`Error: ${e.message}`);
  }
  return createResponse("Next move.");
};

const setMoveToGrid = (player: Player, { x, y }: Coordinates) => {
  if (x < 0 || x > 7 || y < 0 || y > 7) throw Error("Move outside the grid. Choose a position inside the grid.");
  if (grid[y][x]) throw Error("Tried writing over another player. Choose another position.");
  grid[y][x] = player;
};

const createResponse = (msg: string): GameResponse => ({ grid, nextPlayer, msg });
