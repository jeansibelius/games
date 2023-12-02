type Player = 1 | 2;

type Coordinates = {
  x: number;
  y: number;
};

const initGrid = () => [
  // x 0, 1, 2
  [0, 0, 0], // y 0
  [0, 0, 0], // y 1
  [0, 0, 0], // y 2
];

// Game state
let grid: number[][];

export const initGame = () => {
  grid = initGrid();
  return { grid, previousPlayer: 0, msg: "Waiting for the first move." };
};

export const playerMove = (player: Player, { x, y }: Coordinates) => {
  try {
    setMark(player, { x, y });
    if (hasWinningPosition()) {
      return { grid, previousPlayer: player, msg: `Winner: ${player}.` };
    } else if (isGridFull()) {
      return { grid, previousPlayer: player, msg: "Tie. Game over." };
    }
    console.log(grid);
    return { grid, previousPlayer: player, msg: "Next move." };
  } catch (e) {
    console.error(e);
    if (e instanceof Error) return { grid, previousPlayer: player, msg: `Error: ${e.message}` };
  }
};

const setMark = (player: Player, { x, y }: Coordinates) => {
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
