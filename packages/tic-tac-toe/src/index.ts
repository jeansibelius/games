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
  // x 0, 1, 2
  [0, 0, 0], // y 0
  [0, 0, 0], // y 1
  [0, 0, 0], // y 2
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
    nextPlayer = player === 1 ? 2 : 1;
  } catch (e) {
    if (e instanceof Error) return createResponse(`Error: ${e.message}`);
  }
  if (hasWinningPosition()) {
    return createResponse(`Winner: ${player}. Congratulations!`);
  } else if (isGridFull()) {
    return createResponse("Tie. Game over.");
  }
  return createResponse("Next move.");
};

const setMoveToGrid = (player: Player, { x, y }: Coordinates) => {
  if (x < 0 || x > 2 || y < 0 || y > 2) throw Error("Move outside the grid. Choose a position inside the grid.");
  if (grid[y][x]) throw Error("Tried writing over another player. Choose another position.");
  grid[y][x] = player;
};

const hasWinningPosition = () => {
  // Rows
  for (const row of grid) {
    if (row[0] !== 0 && row[0] === row[1] && row[0] === row[2]) return true;
  }
  // Columns
  for (let i = 0; i < 3; i++) {
    if (grid[0][i] !== 0 && grid[0][i] === grid[1][i] && grid[0][i] === grid[2][i]) return true;
  }
  // Diagonals
  if (grid[0][0] !== 0 && grid[0][0] === grid[1][1] && grid[0][0] === grid[2][2]) return true;
  if (grid[2][0] !== 0 && grid[2][0] === grid[1][1] && grid[2][0] === grid[0][2]) return true;

  return false;
};

const isGridFull = () => {
  return !grid.flat().includes(0);
};

const createResponse = (msg: string): GameResponse => ({ grid, nextPlayer, msg });
