import { describe, expect, test } from "vitest";
import { initGame } from "./index.js";

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

    test("the previous player value is 0", () => {
      const { previousPlayer } = initGame();
      expect(previousPlayer).toBe(0);
    });

    test("a message is shown", () => {
      const { msg } = initGame();
      expect(msg).toBeTruthy();
    });
  });
});
