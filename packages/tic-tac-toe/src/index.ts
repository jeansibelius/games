type Player = 1 | 2;

type Coordinates = {
  x: number;
  y: number;
};

const grid = [
  // x 0, 1, 2
  [0, 0, 0], // y 0
  [0, 0, 0], // y 1
  [0, 0, 0], // y 2
];

export const playerMove = (player: Player, { x, y }: Coordinates) => {
  try {
    setMark(player, { x, y });
    if (hasWinningPosition()) {
      return `Winner: ${player}`;
    } else if (isGridFull()) {
      return "Game over";
    }
    console.log(grid);
    return { grid, player };
  } catch (e) {
    console.error(e);
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
