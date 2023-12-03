import { input, select } from "@inquirer/prompts";
import pc from "picocolors";

import { GameResponse, initGame, playerMove } from "tic-tac-toe";

type Choice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  disabled?: boolean | string;
};

const gameChoices: Choice<number>[] = [
  { value: 1, name: "Tic-Tac-Toe" },
  { value: 2, name: `Reversi ${pc.gray("(coming soon)")}`, disabled: true },
];

const main = async () => {
  console.clear();

  console.log();
  console.log(pc.bgBlue(`                    \n   Mini CLI games   \n                    `));
  console.log("\nWelcome to command line two-player games!\n");
  console.log(pc.gray("(exit anytime with Ctrl+C)\n"));

  const gameChoice = await select({ message: "What game would you like to play?", choices: gameChoices });

  switch (gameChoice) {
    case 1:
      await new TicTacToe().play();
      break;
  }

  console.log("Thanks for playing!");
  process.exit(0);
};

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

// Games
class TicTacToe {
  gameTitle = "  Tic-Tac-Toe  ";

  msg = "";
  nextPlayer: 1 | 2 = 1;
  move = { x: NaN, y: NaN };

  play = async () => {
    while (!this.msg.includes("Winner") && !this.msg.includes("Tie")) {
      let latestMove: GameResponse;
      if (!this.msg) {
        latestMove = initGame();
        this.msg = latestMove.msg;
        this.nextPlayer = latestMove.nextPlayer;
        this.renderMove(latestMove);
      }
      this.move = await this.makeChoice();
      latestMove = playerMove(this.nextPlayer, this.move);
      this.msg = latestMove.msg;
      this.nextPlayer = latestMove.nextPlayer;
      this.renderMove(latestMove);
    }
  };

  private makeChoice = async (): Promise<{ x: number; y: number }> => {
    return {
      y: Number(await input({ message: "Choose row (y)" })),
      x: Number(await input({ message: "Choose column (x)" })),
    };
  };

  private renderGrid = (grid: number[][]) => {
    const gridTemplate = [
      " y/x    0     1     2        ", // 0: Index row
      "      _________________      ", // 1: Grid top edge
      "     |     |     |     |     ", // 2: Sign row top padding
      "  Y  |  X  |  X  |  X  |     ", // 3: Sign row
      "     |_____|_____|_____|     ", // 4: Row top & bottom
    ];

    grid.forEach((row, rowNum) => {
      let signRow = gridTemplate[3].replace("Y", pc.dim(String(rowNum)));
      row.forEach((colValue, colNum) => {
        let value = colValue > 0 ? String(colValue) : " ";
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

  private renderMove = (gameResponse: GameResponse) => {
    console.clear();
    console.log(`\n${addLeftPadding(pc.bgBlue(this.gameTitle), getLeftPaddingToCenter(this.gameTitle))}\n`);

    this.renderGrid(gameResponse.grid);

    console.log(`\n${addLeftPadding(gameResponse.msg, getLeftPaddingToCenter(gameResponse.msg))}\n`);

    const nextPlayerMsg = `Your turn, player ${gameResponse.nextPlayer}`;
    console.log(`\n${addLeftPadding(nextPlayerMsg, getLeftPaddingToCenter(nextPlayerMsg, this.gameTitle))}\n`);

    return gameResponse;
  };
}

// Start CLI
await main();
