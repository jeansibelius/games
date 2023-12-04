import { describe, expect, test } from "vitest";
import { initGame } from "./index.js";

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
});
