type Player = 1 | 2;

type Coordinates = {
  x: number;
  y: number;
};

export interface GameResponse {
  grid: typeof grid;
  nextPlayer: Player;
  possibleMoves: Coordinates[];
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
let possibleMoves: Coordinates[];

const togglePlayer = () => {
  nextPlayer = nextPlayer === 1 ? 2 : 1;
};

export const initGame = (): GameResponse => {
  grid = initGrid();
  return createResponse("Waiting for the first move.");
};

export const playerMove = (player: Player, { x, y }: Coordinates): GameResponse => {
  try {
    setMoveToGrid(player, { x, y });
    doFlips(player, { x, y });
  } catch (e) {
    if (e instanceof Error) return createResponse(`Error: ${e.message}`);
  }

  // Find, if there are available moves for next player
  const positionsWhereCanPlay = getEmptyAdjacentCoordinates(grid).reduce(
    (remainingPositions: Coordinates[], positionToCheck) => {
      if (couldFlip(nextPlayer, positionToCheck)) {
        remainingPositions.push(positionToCheck);
      }
      return remainingPositions;
    },
    []
  );
  if (positionsWhereCanPlay.length === 0) {
    return createResponse(`No available moves. ${nextPlayer} move again.`);
  }
  possibleMoves = positionsWhereCanPlay;

  togglePlayer();

  return createResponse("Next move.");
};

const setMoveToGrid = (player: Player, { x, y }: Coordinates) => {
  if (x < 0 || x > 7 || y < 0 || y > 7) throw Error("Move outside the grid. Choose a position inside the grid.");
  if (grid[y][x]) throw Error("Tried writing over another player. Choose another position.");
  grid[y][x] = player;
};

const getEmptyAdjacentCoordinates = (grid: number[][]): Coordinates[] => {
  let outline: Map<string, Coordinates> = new Map();
  grid.forEach((row, rowNum) => {
    row.forEach((col, colNum) => {
      const adjacentCoordinatesToCheck = [
        { x: colNum + 1, y: rowNum }, // Next col
        { x: colNum, y: rowNum + 1 }, // Next row
        { x: colNum + 1, y: rowNum + 1 }, // Bottom-right
        { x: colNum - 1, y: rowNum + 1 }, // Bottom-left
      ];
      adjacentCoordinatesToCheck.forEach(
        (coordinates) => (outline = checkAndMark(grid, col, { x: colNum, y: rowNum }, coordinates, outline))
      );
    });
  });
  return Array.from(outline.values());
};
if (import.meta.vitest) {
  const { describe, test, expect } = await import("vitest");
  describe(getEmptyAdjacentCoordinates.name, () => {
    const fn = getEmptyAdjacentCoordinates;

    const testCases = [
      {
        testGrid: [
          // x 0, 1, 2, 3, 4, 5, 6, 7
          [0, 0, 0, 0, 0, 0, 0, 0], // y 0
          [0, 0, 0, 0, 0, 0, 0, 0], // y 1
          [0, 0, 0, 0, 0, 0, 0, 0], // y 2
          [0, 0, 0, 1, 2, 0, 0, 0], // y 3
          [0, 0, 0, 2, 1, 0, 0, 0], // y 4
          [0, 0, 0, 0, 0, 0, 0, 0], // y 5
          [0, 0, 0, 0, 0, 0, 0, 0], // y 6
          [0, 0, 0, 0, 0, 0, 0, 0], // y 7
        ],
        expectedCoordinates: [
          { x: 2, y: 2 },
          { x: 3, y: 2 },
          { x: 4, y: 2 },
          { x: 5, y: 2 },
          { x: 2, y: 3 },
          { x: 5, y: 3 },
          { x: 2, y: 4 },
          { x: 5, y: 4 },
          { x: 2, y: 5 },
          { x: 3, y: 5 },
          { x: 4, y: 5 },
          { x: 5, y: 5 },
        ],
      },
      {
        testGrid: [
          // x 0, 1, 2, 3, 4, 5, 6, 7
          [0, 0, 0, 0, 0, 0, 0, 0], // y 0
          [0, 0, 0, 0, 0, 0, 0, 0], // y 1
          [0, 0, 0, 0, 0, 0, 0, 0], // y 2
          [0, 0, 0, 1, 2, 0, 0, 0], // y 3
          [0, 0, 0, 2, 1, 0, 0, 0], // y 4
          [0, 0, 0, 0, 2, 1, 0, 0], // y 5
          [0, 0, 0, 0, 0, 0, 0, 0], // y 6
          [0, 0, 0, 0, 0, 0, 0, 0], // y 7
        ],
        expectedCoordinates: [
          { x: 2, y: 2 },
          { x: 3, y: 2 },
          { x: 4, y: 2 },
          { x: 5, y: 2 },
          { x: 2, y: 3 },
          { x: 5, y: 3 },
          { x: 2, y: 4 },
          { x: 5, y: 4 },
          { x: 6, y: 4 },
          { x: 2, y: 5 },
          { x: 3, y: 5 },
          { x: 6, y: 5 },
          { x: 3, y: 6 },
          { x: 4, y: 6 },
          { x: 5, y: 6 },
          { x: 6, y: 6 },
        ],
      },
    ];
    test.each(testCases)("returns correct positions", ({ testGrid, expectedCoordinates }) => {
      const coordinates = fn(testGrid);
      coordinates.forEach((coordinate) => {
        expect(expectedCoordinates).toContainEqual(coordinate);
      });
      expect(expectedCoordinates.length).toBe(coordinates.length);
    });
  });
}

const checkAndMark = (
  grid: number[][],
  currentCellValue: number,
  currentCoordinates: Coordinates,
  adjacentCoordinates: Coordinates,
  recordOfCoordinates: Map<string, Coordinates>
) => {
  const { x, y } = adjacentCoordinates;
  if (x >= 0 && y >= 0 && x < 8 && y < 8) {
    const nextCellValue = grid[y][x];
    if (currentCellValue === 0 && nextCellValue !== 0) {
      // If current is 0,
      // mark, if next is non-0
      const coordinatesToSet = { x: currentCoordinates.x, y: currentCoordinates.y };
      recordOfCoordinates.set(`${coordinatesToSet.x},${coordinatesToSet.y}`, coordinatesToSet);
    } else if (currentCellValue !== 0 && nextCellValue === 0) {
      // Else (current is non-0),
      // mark, if next is 0
      const coordinatesToSet = { x, y };
      recordOfCoordinates.set(`${coordinatesToSet.x},${coordinatesToSet.y}`, coordinatesToSet);
    }
  }
  return recordOfCoordinates;
};

const coordinateDirections = [
  { x: +0, y: +1 }, // Down
  { x: +0, y: -1 }, // Up
  { x: -1, y: +0 }, // Left
  { x: +1, y: +0 }, // Right
  { x: +1, y: +1 }, // Down-Right
  { x: -1, y: +1 }, // Down-Left
  { x: +1, y: -1 }, // Up-Right
  { x: -1, y: -1 }, // Up-Left
];

const couldFlip = (player: Player, fromPosition: Coordinates) => {
  for (const translate of coordinateDirections) {
    const positionsThatCouldFlip = getPositionsThatCanFlip(player, fromPosition, translate);
    if (positionsThatCouldFlip.length > 0) {
      return true;
    }
  }
  false;
};

const doFlips = (player: Player, move: Coordinates) => {
  coordinateDirections.forEach((translate) => {
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
  // Base cases
  if (grid[y][x] === player)
    positionsToFlip = [...positionsToFlip, ...getPositionsThatCanFlip(player, { x, y }, translate)];
  if (x < 0 || y < 0 || x > 7 || y > 7) return positionsToFlip; // Went outside
  if (grid[y][x] === 0) return positionsToFlip; // Reached an empty position
  if (grid[thisPosition.y][thisPosition.x] === player && grid[y][x] !== player) return [{ x, y }]; // Found the enemy, flip all previous

  return positionsToFlip;
};

const createResponse = (msg: string): GameResponse => ({ grid, nextPlayer, possibleMoves, msg });
