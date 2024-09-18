import pc from "picocolors";

import { coordinatePrompt } from "./coordinatePrompt.js";
import { addLeftPadding, getLeftPaddingToCenter } from "./utils.js";

import { GameResponse, initGame, playerMove } from "othello";

interface Coordinates {
  x: number;
  y: number;
}

export class Othello {
  #gameTitle = "  Othello  ";
  #move: Coordinates = { x: 3, y: 3 };
  #latestMove: GameResponse;

  constructor() {
    this.#latestMove = initGame();
    this.renderMove();
  }

  play = async () => {
    while (!this.#latestMove.gameOver) {
      await this.#makeMove();
      this.#latestMove = playerMove(this.#latestMove.nextPlayer, this.#move);
      this.renderMove();
    }
    this.renderMove(); // TODO Render on game over with colored backgrounds?
  };

  #makeMove = async (): Promise<void> => {
    await coordinatePrompt({
      message: "coordinates",
      default: JSON.stringify(this.#move),
      grid: this.#latestMove.grid,
      updateCoordinatesCallback: (coordinates: Coordinates) => {
        this.#move = coordinates;
        this.renderMove();
        return this.#move;
      },
    });
  };

  #getPlayerSign = (value: number) => (value === 1 ? "○" : value === 2 ? "●" : " ");

  #renderGrid = () => {
    const gridTemplate = [
      " y/x    0     1     2     3     4     5     6     7        ", // 0: Index row
      "      _______________________________________________      ", // 1: Grid top edge
      "     |     |     |     |     |     |     |     |     |     ", // 2: Sign row top padding
      "  Y  |  X  |  X  |  X  |  X  |  X  |  X  |  X  |  X  |     ", // 3: Sign row
      "     |_____|_____|_____|_____|_____|_____|_____|_____|     ", // 4: Row top & bottom
    ];

    this.#latestMove.grid.forEach((row, rowNum) => {
      let signRow = gridTemplate[3].replace("Y", pc.dim(String(rowNum)));
      row.forEach((colValue, colNum) => {
        let value = this.#getPlayerSign(colValue);
        if (this.#move.y === rowNum && this.#move.x === colNum) {
          const canPlace =
            value === " " &&
            this.#latestMove.nextPossibleMoves.filter(({ x, y }) => x === colNum && y === rowNum).length === 1;
          let cellColor = canPlace ? pc.bgGreen : pc.bgRed;
          if (this.#latestMove.gameOver)
            cellColor = colValue === 1 ? pc.bgBlack : colValue === 2 ? pc.bgWhite : pc.reset;
          value = cellColor(value);
        }
        signRow = signRow.replace("X", value);
      });

      const indexRow = pc.dim(gridTemplate[0]);
      const gridTopEdge = gridTemplate[1];
      const signRowTopPadding = gridTemplate[2];
      const bottomRow = gridTemplate[4];

      const alignGridBy = getLeftPaddingToCenter(gridTopEdge);
      rowNum === 0 && console.log(addLeftPadding(indexRow, alignGridBy));
      rowNum === 0 && console.log(addLeftPadding(gridTopEdge, alignGridBy));
      console.log(addLeftPadding(signRowTopPadding, alignGridBy));
      console.log(addLeftPadding(signRow, alignGridBy));
      console.log(addLeftPadding(bottomRow, alignGridBy));
    });
  };

  private renderMove = () => {
    console.clear();
    console.log(`\n${addLeftPadding(pc.bgBlue(this.#gameTitle), getLeftPaddingToCenter(this.#gameTitle))}\n`);

    this.#renderGrid();

    if (!this.#latestMove.gameOver) {
      const nextPlayerMsg = `${this.#getPlayerSign(this.#latestMove.nextPlayer)}'s turn`;
      console.log(`\n${addLeftPadding(nextPlayerMsg, getLeftPaddingToCenter(nextPlayerMsg))}`);
    }
    console.log(`\n${addLeftPadding(this.#latestMove.msg, getLeftPaddingToCenter(this.#latestMove.msg))}`);

    const pointSituation = `Points: ${Object.entries(this.#latestMove.points)
      .map((player) => `${this.#getPlayerSign(Number(player[0]))}: ${String(player[1])}`)
      .join(", ")}`;
    const pointsColor = this.#latestMove.gameOver ? pc.green : pc.gray;
    console.log(pointsColor(`\n${addLeftPadding(pointSituation, getLeftPaddingToCenter(pointSituation))}\n`));

    return this.#latestMove;
  };
}
