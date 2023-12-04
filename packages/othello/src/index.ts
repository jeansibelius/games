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
    doFlips(player, { x, y });

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

const doFlips = (player: Player, move: Coordinates) => {
  const directionsToCheck = [
    { x: +0, y: +1 }, // Down
    { x: +0, y: -1 }, // Up
    { x: -1, y: +0 }, // Left
    { x: +1, y: +0 }, // Right
    { x: +1, y: +1 }, // Down-Right
    { x: -1, y: +1 }, // Down-Left
    { x: +1, y: -1 }, // Up-Right
    { x: -1, y: -1 }, // Up-Left
  ];
  directionsToCheck.forEach((translate) => {
    getPositionsThatCanFlip(player, move, translate).forEach(({ x, y }) => {
      grid[y][x] = player;
    });
  });
};

const getPositionsThatCanFlip = (
  player: Player,
  thisPosition: Coordinates,
  translate: Coordinates,
  positionsToFlip: Coordinates[] = []
) => {
  const { x, y } = { x: thisPosition.x + translate.x, y: thisPosition.y + translate.y };
  console.log("x y", x, y);
  // Base cases
  if (grid[y][x] === player)
    positionsToFlip = [...positionsToFlip, ...getPositionsThatCanFlip(player, { x, y }, translate)];
  if (x < 0 || y < 0 || x > 7 || y > 7) return positionsToFlip; // Went outside
  if (grid[y][x] === 0) return positionsToFlip; // Reached an empty position
  if (grid[y][x] !== player) return [{ x, y }]; // Found the enemy, flip all previous
  console.log("positionsToFlip:", positionsToFlip);

  return positionsToFlip;
};

const createResponse = (msg: string): GameResponse => ({ grid, nextPlayer, msg });
