import { beforeEach, describe, expect, test } from "vitest";
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
      const { grid: newGrid, nextPlayer: newNextPlayer, msg: newMsg } = playerMove(currentPlayer, { x: 5, y: 3 });
      grid = newGrid;
      nextPlayer = newNextPlayer;
      msg = newMsg;
    });

    test("the grid with the new move is returned", () => {
      const gridAfterMove = [
        // x 0, 1, 2, 3, 4, 5, 6, 7
        [0, 0, 0, 0, 0, 0, 0, 0], // y 0
        [0, 0, 0, 0, 0, 0, 0, 0], // y 1
        [0, 0, 0, 0, 0, 0, 0, 0], // y 2
        [0, 0, 0, 1, 2, 1, 0, 0], // y 3
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

    test("a message is shown", () => {
      expect(msg).toBeTruthy();
    });
});
