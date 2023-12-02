import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { initGame, playerMove } from "./index.js";

describe("Playing tic-tac-toe", () => {
  describe("when initialing a game", () => {
    test("a 3x3 grid is initialised with zeros", () => {
      const { grid } = initGame();
      const initGrid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      expect(grid).toStrictEqual(initGrid);
    });

    test("the next player value is 1", () => {
      const { nextPlayer } = initGame();
      expect(nextPlayer).toBe(1);
    });

    test("a message is shown", () => {
      const { msg } = initGame();
      expect(msg).toBeTruthy();
    });
  });

  describe("when making a single move", () => {
    const currentPlayer = 1;
    let grid: number[][];
    let nextPlayer: 1 | 2;
    let msg: string;
    beforeEach(() => {
      initGame();
      const { grid: newGrid, nextPlayer: newNextPlayer, msg: newMsg } = playerMove(currentPlayer, { x: 0, y: 0 });
      grid = newGrid;
      nextPlayer = newNextPlayer;
      msg = newMsg;
    });

    test("the grid with the new move is returned", () => {
      const gridAfterMove = [
        [currentPlayer, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      expect(grid).toStrictEqual(gridAfterMove);
    });

    test("the next player value is not who made the latest move", () => {
      expect(nextPlayer).not.toBe(currentPlayer);
    });

    test("a message is shown", () => {
      expect(msg).toBeTruthy();
    });

    describe("if one tries to overwrite an existing move", () => {
      const currentPlayer = 2;
      let followingGrid: number[][];
      let followingNextPlayer: number;
      let followingMsg: string;
      beforeEach(() => {
        const { grid: newGrid, nextPlayer: newPreviousPlayer, msg: newMsg } = playerMove(currentPlayer, { x: 0, y: 0 });
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
        expect(followingMsg).toContain("Choose another position");
      });
    });

    const outsideMoves = [
      { x: -1, y: 2 },
      { x: 3, y: 2 },
      { x: 1, y: -1 },
      { x: 0, y: 3 },
    ];
    describe.each(outsideMoves)("if one makes a move outside the grid", (outsideMove) => {
      let followingGrid: number[][];
      let followingNextPlayer: number;
      let followingMsg: string;
      beforeAll(() => {
        const { grid: newGrid, nextPlayer: newNextPlayer, msg: newMsg } = playerMove(nextPlayer, outsideMove);
        followingGrid = newGrid;
        followingNextPlayer = newNextPlayer;
        followingMsg = newMsg;
      });

      test("the grid is returned unchaged", () => {
        expect(followingGrid).toStrictEqual(grid);
      });

      test("the next player value is unchanged", () => {
        expect(followingNextPlayer).toBe(nextPlayer);
      });

      test("a helpful error message is returned", () => {
        expect(followingMsg).toContain("Choose a position inside the grid");
      });
    });
  });

  const winningScenarios = [
    {
      gridToPrepare: [
        [1, 0, 0],
        [1, 0, 0],
        [0, 0, 0],
      ],
      nextMove: { x: 0, y: 2 },
    },
    {
      gridToPrepare: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
      nextMove: { x: 2, y: 2 },
    },
    {
      gridToPrepare: [
        [1, 1, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      nextMove: { x: 2, y: 0 },
    },
    {
      gridToPrepare: [
        [0, 0, 1],
        [0, 1, 0],
        [0, 0, 0],
      ],
      nextMove: { x: 0, y: 2 },
    },
  ];
  describe.each(winningScenarios)("when a player makes a winning move", ({ gridToPrepare, nextMove }) => {
    const currentPlayer = 1;
    let grid: number[][];
    let msg: string;
    beforeAll(() => {
      initGame();
      gridToPrepare.forEach((row, y) => {
        row.forEach((cell, x) => {
          cell === 1 && playerMove(currentPlayer, { x, y });
        });
      });
      const { grid: newGrid, msg: newMsg } = playerMove(currentPlayer, nextMove);
      grid = newGrid;
      msg = newMsg;
    });

    test("the grid with the winning move is returned", () => {
      const gridAfterMove = gridToPrepare;
      gridAfterMove[nextMove.y][nextMove.x] = currentPlayer;
      expect(grid).toStrictEqual(gridAfterMove);
    });

    test("a message is shown", () => {
      expect(msg).toContain("Winner");
    });
  });

  describe("when a player fills the last available cell", () => {
    const gridToPrepare = [
      [1, 2, 1],
      [2, 1, 1],
      [2, 0, 2],
    ];
    const lastMove = { x: 1, y: 2 };

    const currentPlayer = 1;
    let grid: number[][];
    let msg: string;
    beforeAll(() => {
      initGame();
      gridToPrepare.forEach((row, y) => {
        row.forEach((cell, x) => {
          cell === 1 && playerMove(1, { x, y });
          cell === 2 && playerMove(2, { x, y });
        });
      });
      const { grid: newGrid, msg: newMsg } = playerMove(currentPlayer, lastMove);
      grid = newGrid;
      msg = newMsg;
    });

    test("the grid full is returned", () => {
      const gridAfterMove = gridToPrepare;
      gridAfterMove[lastMove.y][lastMove.x] = currentPlayer;
      expect(grid).toStrictEqual(gridAfterMove);
    });

    test("a message is shown", () => {
      expect(msg).toContain("Tie");
    });
  });
});
