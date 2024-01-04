const defaultGrid = () => [
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
let grid;
let nextPlayer = 1;
let nextPossibleMoves;
const togglePlayer = () => {
    return (nextPlayer = nextPlayer === 1 ? 2 : 1);
};
export const initGame = (initGrid = defaultGrid()) => {
    grid = initGrid;
    nextPlayer = 1;
    nextPossibleMoves = [];
    return createResponse("Waiting for the first move.");
};
export const playerMove = (player, { x, y }) => {
    let response;
    try {
        setMoveToGrid(player, { x, y });
        doFlips(player, { x, y });
        togglePlayer();
    }
    catch (e) {
        if (e instanceof Error)
            response = createErrorResponse(e);
    }
    // Find, if there are available moves for next player
    try {
        nextPossibleMoves = getAvailableMoves(nextPlayer);
    }
    catch (e) {
        // If the next player can't move, toggle player back to original
        togglePlayer();
        try {
            nextPossibleMoves = getAvailableMoves(nextPlayer);
            if (e instanceof Error)
                response = createErrorResponse(e);
        }
        catch (e) {
            // If also the original player can't move, the game is over & announce winner
            const { player1, player2 } = countFinal();
            response = createResponse(`Game over. Winner is player ${togglePlayer()}. Player 1: ${player1}. Player 2: ${player2}.`);
        }
    }
    return response || createResponse("Next move.");
};
const setMoveToGrid = (player, { x, y }) => {
    if (x < 0 || x > 7 || y < 0 || y > 7)
        throw Error("Move outside the grid. Choose a position inside the grid.");
    if (grid[y][x])
        throw Error("Tried writing over another player. Choose another position.");
    grid[y][x] = player;
};
const getEmptyAdjacentCoordinates = (grid) => {
    let outline = new Map();
    grid.forEach((row, rowNum) => {
        row.forEach((col, colNum) => {
            const adjacentCoordinatesToCheck = [
                { x: colNum + 1, y: rowNum }, // Next col
                { x: colNum, y: rowNum + 1 }, // Next row
                { x: colNum + 1, y: rowNum + 1 }, // Bottom-right
                { x: colNum - 1, y: rowNum + 1 }, // Bottom-left
            ];
            adjacentCoordinatesToCheck.forEach((coordinates) => (outline = checkAndMark(grid, col, { x: colNum, y: rowNum }, coordinates, outline)));
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
const checkAndMark = (grid, currentCellValue, currentCoordinates, adjacentCoordinates, recordOfCoordinates) => {
    const { x, y } = adjacentCoordinates;
    if (x >= 0 && y >= 0 && x < 8 && y < 8) {
        const nextCellValue = grid[y][x];
        if (currentCellValue === 0 && nextCellValue !== 0) {
            // If current is 0,
            // mark, if next is non-0
            const coordinatesToSet = { x: currentCoordinates.x, y: currentCoordinates.y };
            recordOfCoordinates.set(`${coordinatesToSet.x},${coordinatesToSet.y}`, coordinatesToSet);
        }
        else if (currentCellValue !== 0 && nextCellValue === 0) {
            // Else (current is non-0),
            // mark, if next is 0
            const coordinatesToSet = { x, y };
            recordOfCoordinates.set(`${coordinatesToSet.x},${coordinatesToSet.y}`, coordinatesToSet);
        }
    }
    return recordOfCoordinates;
};
const getAvailableMoves = (player) => {
    const positionsWhereCanPlay = getEmptyAdjacentCoordinates(grid).filter((positionToCheck) => couldFlip(player, positionToCheck));
    if (positionsWhereCanPlay.length === 0)
        throw Error(`No available moves.`);
    return positionsWhereCanPlay;
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
const couldFlip = (player, fromPosition) => {
    for (const translate of coordinateDirections) {
        const positionsThatCouldFlip = getPositionsThatCanFlip(grid, player, fromPosition, translate);
        if (positionsThatCouldFlip)
            return true;
    }
    return false;
};
const doFlips = (player, move) => {
    coordinateDirections.forEach((translate) => {
        const positionsToFlip = getPositionsThatCanFlip(grid, player, move, translate);
        if (positionsToFlip)
            positionsToFlip.forEach(({ x, y }) => (grid[y][x] = player));
    });
};
const getPositionsThatCanFlip = (gridToCheck, player, thisPosition, translate, positionsToFlip = []) => {
    const { x, y } = { x: thisPosition.x + translate.x, y: thisPosition.y + translate.y };
    // Base cases
    if (x < 0 || y < 0 || x > 7 || y > 7)
        return; // Went outside
    if (gridToCheck[y][x] === 0)
        return; // Reached an empty position
    if (gridToCheck[thisPosition.y][thisPosition.x] === player && gridToCheck[y][x] === player)
        return; // Two consecutive for player
    if (gridToCheck[y][x] !== player) {
        const foundEnemy = getPositionsThatCanFlip(gridToCheck, player, { x, y }, translate);
        if (foundEnemy)
            positionsToFlip = positionsToFlip.concat({ x, y }, ...foundEnemy);
    }
    if (gridToCheck[thisPosition.y][thisPosition.x] !== 0 && // Current position should not be empty
        gridToCheck[thisPosition.y][thisPosition.x] !== player && // and it should be the opposite player
        gridToCheck[y][x] === player // and next position is the player
    ) {
        return []; // Found the enemy, collect coordinates
    }
    if (positionsToFlip.length > 0)
        return positionsToFlip;
};
const countFinal = () => {
    let player1 = 0;
    let player2 = 0;
    grid.forEach((row) => {
        row.forEach((cell) => {
            if (cell === 1)
                player1++;
            if (cell === 2)
                player2++;
        });
    });
    return { player1, player2 };
};
const createErrorResponse = (e) => createResponse(`Error: ${e.message}. Player ${nextPlayer} move again.`);
const createResponse = (msg) => ({ grid, nextPlayer, nextPossibleMoves, msg });