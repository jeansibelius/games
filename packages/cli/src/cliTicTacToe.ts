import { GameResponse, initGame, playerMove } from "../../tic-tac-toe/src/index.ts";
import { coordinatePrompt } from "./coordinatePrompt.ts";

import pc from "picocolors";

const terminalSize = {
  width: process.stdout.columns,
  height: process.stdout.rows,
};

const addLeftPadding = (str: string, leftPadding: number) => {
  return " ".repeat(leftPadding).concat(str);
};

const getLeftPaddingToCenter = (str: string, centerBy?: string) => {
  const strLen = centerBy ? str.length - centerBy.length + str.length : str.length;
  return Math.floor((terminalSize.width - strLen) / 2);
};

interface Coordinates {
  x: number;
  y: number;
}

export class TicTacToe {
  gameTitle = "  Tic-Tac-Toe  ";

  move: Coordinates = { x: 1, y: 1 };
  latestMove: GameResponse;

  constructor() {
    this.latestMove = initGame();
    this.renderMove();
  }

  play = async () => {
    while (!this.latestMove.msg.includes("Winner") && !this.latestMove.msg.includes("Tie")) {
      await this.makeMove();
      this.latestMove = playerMove(this.latestMove.nextPlayer, this.move);
      this.renderMove();
    }
  };

  private makeMove = async (): Promise<void> => {
    await coordinatePrompt({
      message: "coordinates",
      default: JSON.stringify(this.move),
      updateCoordinatesCallback: (coordinates: Coordinates) => {
        this.move = coordinates;
        this.renderMove();
        return this.move;
      },
    });
  };

  private renderGrid = () => {
    const gridTemplate = [
      " y/x    0     1     2        ", // 0: Index row
      "      _________________      ", // 1: Grid top edge
      "     |     |     |     |     ", // 2: Sign row top padding
      "  Y  |  X  |  X  |  X  |     ", // 3: Sign row
      "     |_____|_____|_____|     ", // 4: Row top & bottom
    ];

    this.latestMove.grid.forEach((row, rowNum) => {
      let signRow = gridTemplate[3].replace("Y", pc.dim(String(rowNum)));
      row.forEach((colValue, colNum) => {
        let value = colValue > 0 ? String(colValue) : " ";
        if (this.move.y === rowNum && this.move.x === colNum) {
          const cellColor = value === " " ? pc.bgGreen : pc.bgRed;
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
    console.log(`\n${addLeftPadding(pc.bgBlue(this.gameTitle), getLeftPaddingToCenter(this.gameTitle))}\n`);

    this.renderGrid();

    const NextMoveMsg = `\n${addLeftPadding(this.latestMove.msg, getLeftPaddingToCenter(this.latestMove.msg))}\n`;
    console.log(NextMoveMsg);

    const nextPlayerMsg = `Your turn, player ${this.latestMove.nextPlayer}`;
    !this.latestMove.msg.includes("Winner") &&
      console.log(`\n${addLeftPadding(nextPlayerMsg, getLeftPaddingToCenter(nextPlayerMsg, this.gameTitle))}\n`);

    return this.latestMove;
  };
}
