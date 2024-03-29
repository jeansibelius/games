import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { initGame, playerMove } from "./index.js";

describe("Playing Othello", () => {
  describe("when initialing a game", () => {
    test("a 8x8 grid is initialised with zeros and start pattern", () => {
      const { grid } = initGame();
      const initGrid = [
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
      expect(grid).toStrictEqual(initGrid);
    });

    test("the next player value is 1", () => {
      const { nextPlayer } = initGame();
      expect(nextPlayer).toBe(1);
    });

    test("the game is not over", () => {
      const { gameOver } = initGame();
      expect(gameOver).toBe(false);
    });

    test("the points are correct", () => {
      const { points } = initGame();
      expect(points).toStrictEqual({ 1: 2, 2: 2 });
    });

    test("a message is shown", () => {
      const { msg } = initGame();
      expect(msg).toBeTruthy();
    });
  });

  describe("when making a single move", () => {
    const currentPlayer = 1;
    const latestMove = { x: 5, y: 3 };
    let grid: number[][];
    let nextPlayer: 1 | 2;
    let newNextPossibleMoves: (typeof latestMove)[];
    let msg: string;
    beforeAll(() => {
      initGame();
      const {
        grid: newGrid,
        nextPlayer: newNextPlayer,
        nextPossibleMoves,
        msg: newMsg,
      } = playerMove(currentPlayer, latestMove);
      grid = newGrid;
      nextPlayer = newNextPlayer;
      newNextPossibleMoves = nextPossibleMoves;
      msg = newMsg;
    });

    test("the grid with the new move is returned", () => {
      const gridAfterMove = [
        // x 0, 1, 2, 3, 4, 5, 6, 7
        [0, 0, 0, 0, 0, 0, 0, 0], // y 0
        [0, 0, 0, 0, 0, 0, 0, 0], // y 1
        [0, 0, 0, 0, 0, 0, 0, 0], // y 2
        [0, 0, 0, 1, 1, 1, 0, 0], // y 3
        [0, 0, 0, 2, 1, 0, 0, 0], // y 4
        [0, 0, 0, 0, 0, 0, 0, 0], // y 5
        [0, 0, 0, 0, 0, 0, 0, 0], // y 6
        [0, 0, 0, 0, 0, 0, 0, 0], // y 7
      ];
      expect(grid).toStrictEqual(gridAfterMove);
    });

    test("the next player value is not who made the latest move", () => {
      expect(nextPlayer).not.toBe(currentPlayer);
    });

    test("the next possible moves are correct", () => {
      expect(newNextPossibleMoves).toStrictEqual([
        { x: 3, y: 2 },
        { x: 5, y: 2 },
        { x: 5, y: 4 },
      ]);
    });

    test("a message is shown", () => {
      expect(msg).toBeTruthy();
    });

    describe("and when making a subsequent move", () => {
      const latestMove = { x: 5, y: 2 };
      let grid: number[][];
      let newPoints: Record<typeof nextPlayer, number>;
      let nextNextPossibleMoves: (typeof latestMove)[];
      beforeAll(() => {
        const {
          grid: newGrid,
          nextPlayer: newNextPlayer,
          nextPossibleMoves,
          points,
        } = playerMove(nextPlayer, latestMove);
        grid = newGrid;
        nextPlayer = newNextPlayer;
        nextNextPossibleMoves = nextPossibleMoves;
        newPoints = points;
      });

      test("the grid with the new move is returned", () => {
        const gridAfterMove = [
          // x 0, 1, 2, 3, 4, 5, 6, 7
          [0, 0, 0, 0, 0, 0, 0, 0], // y 0
          [0, 0, 0, 0, 0, 0, 0, 0], // y 1
          [0, 0, 0, 0, 0, 2, 0, 0], // y 2
          [0, 0, 0, 1, 2, 1, 0, 0], // y 3
          [0, 0, 0, 2, 1, 0, 0, 0], // y 4
          [0, 0, 0, 0, 0, 0, 0, 0], // y 5
          [0, 0, 0, 0, 0, 0, 0, 0], // y 6
          [0, 0, 0, 0, 0, 0, 0, 0], // y 7
        ];
        expect(grid).toStrictEqual(gridAfterMove);
      });

      test("the next possible moves are correct", () => {
        expect(nextNextPossibleMoves).toStrictEqual([
          { x: 5, y: 1 },
          { x: 4, y: 2 },
          { x: 2, y: 4 },
          { x: 3, y: 5 },
        ]);
      });

      test("the points are correct", () => {
        expect(newPoints).toStrictEqual({ 1: 3, 2: 3 });
      });
    });
  });

  describe("when one tries to overwrite an existing move", () => {
    let grid: number[][];
    let nextPlayer: 1 | 2;
    const moveThatWouldOverwrite = { x: 3, y: 3 };
    let followingGrid: number[][];
    let followingNextPlayer: number;
    let followingMsg: string;
    beforeEach(() => {
      const { nextPlayer: initNextPlayer, grid: initGrid } = initGame();
      nextPlayer = initNextPlayer;
      grid = initGrid;
      const {
        grid: newGrid,
        nextPlayer: newPreviousPlayer,
        msg: newMsg,
      } = playerMove(nextPlayer, moveThatWouldOverwrite);
      followingGrid = newGrid;
      followingNextPlayer = newPreviousPlayer;
      followingMsg = newMsg;
    });

    test("the grid is returned unchaged", () => {
      expect(followingGrid).toStrictEqual(grid);
    });

    test("the next player value is unchaged", () => {
      expect(followingNextPlayer).toBe(nextPlayer);
    });

    test("a helpful error message is returned", () => {
      expect(followingMsg).toContain("Can't place there");
    });
  });

  const outsideMoves = [
    { x: -1, y: 2 },
    { x: 8, y: 2 },
    { x: 1, y: -1 },
    { x: 0, y: 8 },
  ];
  describe.each(outsideMoves)("when one makes a move outside the grid", (outsideMove) => {
    let nextPlayer: 1 | 2;
    let grid: number[][];
    let points: Record<typeof followingNextPlayer, number>;
    let followingPoints: typeof points;
    let followingGrid: number[][];
    let followingNextPlayer: number;
    let followingMsg: string;
    beforeAll(() => {
      const { nextPlayer: initNextPlayer, grid: initGrid, points: initPoints } = initGame();
      nextPlayer = initNextPlayer;
      grid = initGrid;
      points = initPoints;
      const {
        grid: newGrid,
        nextPlayer: newNextPlayer,
        points: newPoints,
        msg: newMsg,
      } = playerMove(nextPlayer, outsideMove);
      followingGrid = newGrid;
      followingNextPlayer = newNextPlayer;
      followingPoints = newPoints;
      followingMsg = newMsg;
    });

    test("the grid is returned unchaged", () => {
      expect(followingGrid).toStrictEqual(grid);
    });

    test("the next player value is unchanged", () => {
      expect(followingNextPlayer).toBe(nextPlayer);
    });

    test("the points are unchanged", () => {
      expect(followingPoints).toStrictEqual(points);
    });

    test("a helpful error message is returned", () => {
      expect(followingMsg).toContain("Can't place there");
    });
  });

  describe("when the next player has no available moves", () => {
    const gridToInitialise = [
      // x 0, 1, 2, 3, 4, 5, 6, 7
      [0, 0, 0, 1, 1, 1, 1, 1], // y 0
      [0, 0, 0, 1, 1, 1, 1, 1], // y 1
      [0, 0, 0, 1, 1, 1, 1, 1], // y 2
      [0, 0, 0, 1, 2, 1, 1, 1], // y 3
      [0, 0, 0, 2, 0, 1, 1, 1], // y 4
      [0, 0, 0, 0, 0, 0, 0, 0], // y 5
      [0, 0, 0, 0, 0, 0, 0, 0], // y 6
      [0, 0, 0, 0, 0, 0, 0, 0], // y 7
    ];
    const currentPlayer = 1;
    const nextMove = { x: 4, y: 4 };
    let newGrid: number[][];
    let newNextPlayer: 1 | 2;
    let newGameOver: boolean;
    let newNextPossibleMoves: (typeof nextMove)[];
    let newMsg: string;
    beforeAll(() => {
      initGame(gridToInitialise);
      const { grid, gameOver, nextPlayer, nextPossibleMoves, msg } = playerMove(currentPlayer, nextMove);
      newGrid = grid;
      newGameOver = gameOver;
      newNextPlayer = nextPlayer;
      newNextPossibleMoves = nextPossibleMoves;
      newMsg = msg;
    });

    test("the grid with the latest move is returned", () => {
      const gridWithNoNextMove = [
        // x 0, 1, 2, 3, 4, 5, 6, 7
        [0, 0, 0, 1, 1, 1, 1, 1], // y 0
        [0, 0, 0, 1, 1, 1, 1, 1], // y 1
        [0, 0, 0, 1, 1, 1, 1, 1], // y 2
        [0, 0, 0, 1, 1, 1, 1, 1], // y 3
        [0, 0, 0, 2, 1, 1, 1, 1], // y 4
        [0, 0, 0, 0, 0, 0, 0, 0], // y 5
        [0, 0, 0, 0, 0, 0, 0, 0], // y 6
        [0, 0, 0, 0, 0, 0, 0, 0], // y 7
      ];
      expect(newGrid).toStrictEqual(gridWithNoNextMove);
    });

    test("a message with 'no available moves' is shown", () => {
      expect(newMsg).toContain("No available moves.");
    });

    test("the next player value is the one who made the latest move", () => {
      expect(newNextPlayer).toBe(currentPlayer);
    });

    test("the game is not over", () => {
      expect(newGameOver).toBe(false);
    });

    test("the next possible moves are correct", () => {
      expect(newNextPossibleMoves).toStrictEqual([
        { x: 2, y: 4 },
        { x: 3, y: 5 },
        { x: 2, y: 5 },
      ]);
    });
  });

  describe("when the next move is the last possible move", () => {
    describe("and there is a winner", () => {
      const gridToInitialise = [
        // x 0, 1, 2, 3, 4, 5, 6, 7
        [2, 2, 2, 2, 2, 2, 2, 2], // y 0
        [2, 2, 2, 1, 1, 1, 2, 2], // y 1
        [2, 2, 1, 2, 2, 1, 2, 2], // y 2
        [2, 2, 2, 1, 2, 1, 2, 2], // y 3
        [2, 2, 2, 2, 1, 1, 2, 2], // y 4
        [2, 2, 2, 1, 1, 1, 2, 2], // y 5
        [2, 2, 2, 1, 2, 2, 2, 2], // y 6
        [2, 2, 0, 1, 2, 2, 2, 2], // y 7
      ];
      const currentPlayer = 2;
      const nextMove = { x: 2, y: 7 };
      let newGrid: number[][];
      let newGameOver: boolean;
      let newNextPlayer: 1 | 2;
      let newNextPossibleMoves: (typeof nextMove)[];
      let newPoints: Record<typeof newNextPlayer, number>;
      let newMsg: string;
      beforeAll(() => {
        initGame(gridToInitialise);
        const { grid, gameOver, nextPlayer, nextPossibleMoves, points, msg } = playerMove(currentPlayer, nextMove);
        newGrid = grid;
        newGameOver = gameOver;
        newNextPlayer = nextPlayer;
        newNextPossibleMoves = nextPossibleMoves;
        newPoints = points;
        newMsg = msg;
      });

      test("the grid with the latest move is returned", () => {
        const fullGrid = [
          // x 0, 1, 2, 3, 4, 5, 6, 7
          [2, 2, 2, 2, 2, 2, 2, 2], // y 0 2: 8, 1: 0
          [2, 2, 2, 1, 1, 1, 2, 2], // y 1 2: 5, 1: 3
          [2, 2, 1, 2, 2, 1, 2, 2], // y 2 2: 6, 1: 2
          [2, 2, 2, 1, 2, 1, 2, 2], // y 3 2: 6, 1: 2
          [2, 2, 2, 2, 1, 2, 2, 2], // y 4 2: 7, 1: 1
          [2, 2, 2, 1, 2, 1, 2, 2], // y 5 2: 6, 1: 2
          [2, 2, 2, 2, 2, 2, 2, 2], // y 6 2: 8, 1: 0
          [2, 2, 2, 2, 2, 2, 2, 2], // y 7 2: 8, 1: 0
        ];
        expect(newGrid).toStrictEqual(fullGrid);
      });

      test("the game is over", () => {
        expect(newGameOver).toBe(true);
      });

      test("the points are correct", () => {
        expect(newPoints).toStrictEqual({ 1: 10, 2: 54 });
      });

      test("a message with 'game over' and 'winner' is shown", () => {
        expect(newMsg).toContain("Game over");
        expect(newMsg).toContain("We have a Winner");
      });

      test("the next player value is the one who made the latest move", () => {
        expect(newNextPlayer).toBe(currentPlayer);
      });

      test("there are no next possible moves", () => {
        expect(newNextPossibleMoves).toStrictEqual([]);
      });
    });

    describe("and it's a tie", () => {
      const gridToInitialise = [
        // x 0, 1, 2, 3, 4, 5, 6, 7
        [2, 2, 2, 2, 1, 1, 1, 1], // y 0
        [2, 2, 2, 2, 1, 1, 1, 1], // y 1
        [2, 2, 2, 2, 1, 1, 1, 1], // y 2
        [2, 2, 2, 2, 1, 1, 1, 1], // y 3
        [2, 2, 2, 2, 1, 1, 1, 1], // y 4
        [2, 2, 2, 2, 1, 1, 1, 1], // y 5
        [2, 2, 1, 2, 1, 1, 1, 1], // y 6
        [2, 2, 0, 2, 1, 1, 1, 1], // y 7
      ];
      const currentPlayer = 2;
      const nextMove = { x: 2, y: 7 };
      let newGrid: number[][];
      let newGameOver: boolean;
      let newNextPlayer: 1 | 2;
      let newNextPossibleMoves: (typeof nextMove)[];
      let newPoints: Record<typeof newNextPlayer, number>;
      let newMsg: string;
      beforeAll(() => {
        initGame(gridToInitialise);
        const { grid, gameOver, nextPlayer, nextPossibleMoves, points, msg } = playerMove(currentPlayer, nextMove);
        newGrid = grid;
        newGameOver = gameOver;
        newNextPlayer = nextPlayer;
        newNextPossibleMoves = nextPossibleMoves;
        newPoints = points;
        newMsg = msg;
      });

      test("the grid with the latest move is returned", () => {
        const fullGrid = [
          // x 0, 1, 2, 3, 4, 5, 6, 7
          [2, 2, 2, 2, 1, 1, 1, 1], // y 0
          [2, 2, 2, 2, 1, 1, 1, 1], // y 1
          [2, 2, 2, 2, 1, 1, 1, 1], // y 2
          [2, 2, 2, 2, 1, 1, 1, 1], // y 3
          [2, 2, 2, 2, 1, 1, 1, 1], // y 4
          [2, 2, 2, 2, 1, 1, 1, 1], // y 5
          [2, 2, 2, 2, 1, 1, 1, 1], // y 6
          [2, 2, 2, 2, 1, 1, 1, 1], // y 7
        ];
        expect(newGrid).toStrictEqual(fullGrid);
      });

      test("the game is over", () => {
        expect(newGameOver).toBe(true);
      });

      test("the points are correct", () => {
        expect(newPoints).toStrictEqual({ 1: 32, 2: 32 });
      });

      test("a message with 'game over' and 'tie' is shown", () => {
        expect(newMsg).toContain("Game over");
        expect(newMsg).toContain("It's a tie");
      });

      test("the next player value is the one who made the latest move", () => {
        expect(newNextPlayer).toBe(currentPlayer);
      });

      test("there are no next possible moves", () => {
        expect(newNextPossibleMoves).toStrictEqual([]);
      });
    });
  });
});
