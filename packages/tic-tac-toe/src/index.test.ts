import { beforeEach, describe, expect, test } from "vitest";
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

    test("the previous player value is 1", () => {
      const { previousPlayer } = initGame();
      expect(previousPlayer).toBe(1);
    });

    test("a message is shown", () => {
      const { msg } = initGame();
      expect(msg).toBeTruthy();
    });
  });

  describe("when making a single move", () => {
    const currentPlayer = 1;
    let grid: number[][];
    let previousPlayer: number;
    let msg: string;
    beforeEach(() => {
      initGame();
      const {
        grid: newGrid,
        previousPlayer: newPreviousPlayer,
        msg: newMsg,
      } = playerMove(currentPlayer, { x: 0, y: 0 });
      grid = newGrid;
      previousPlayer = newPreviousPlayer;
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

    test("the previous player value is who made the latest move", () => {
      expect(previousPlayer).toBe(currentPlayer);
    });

    test("a message is shown", () => {
      expect(msg).toBeTruthy();
    });

    describe("if one tries to overwrite an existing move", () => {
      const currentPlayer = 2;
      let followingGrid: number[][];
      let followingPreviousPlayer: number;
      let followingMsg: string;
      beforeEach(() => {
        const {
          grid: newGrid,
          previousPlayer: newPreviousPlayer,
          msg: newMsg,
        } = playerMove(currentPlayer, { x: 0, y: 0 });
        followingGrid = newGrid;
        followingPreviousPlayer = newPreviousPlayer;
        followingMsg = newMsg;
      });

      test("the grid is returned unchaged", () => {
        expect(followingGrid).toStrictEqual(grid);
      });

      test("the previous player value is NOT set to the latest one", () => {
        expect(followingPreviousPlayer).toBe(previousPlayer);
      });

      test("a helpful error message is returned", () => {
        expect(followingMsg).toContain("Choose another position");
      });
    });
  });
});
