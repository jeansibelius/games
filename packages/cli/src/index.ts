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
  console.log(pc.bgBlue(`  Mini CLI games  `));
  console.log();
  console.log("Welcome!");
  console.log();
  console.log(pc.gray("Exit anytime with Ctrl+C\n"));

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

const centered = (str: string, centerBy?: string) => {
  return " "
    .repeat(Math.floor((terminalSize.width - (centerBy ? centerBy.length / 2 + str.length : str.length)) / 2))
    .concat(str);
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
    grid.forEach((row, rowNum) => {
      const signRowContent = JSON.stringify(row)
        .replaceAll(/0/g, "   ")
        .replaceAll(/(\d)/g, " $1 ")
        .replaceAll(/\[/g, "| ")
        .replaceAll(/,/g, " | ")
        .replaceAll(/\]/g, " |");

      const coordinateRow = `y/x    0     1     2   `;
      const topRow = `     _________________ `;
      const signRowSeparator = `    |     |     |     |`;
      const bottomRow = `    |_____|_____|_____|`;
      const signRow = ` ${rowNum}  ${signRowContent}`;

      const gridSize = coordinateRow;
      rowNum === 0 && console.log(centered(coordinateRow, gridSize));
      rowNum === 0 && console.log(centered(topRow, gridSize));
      console.log(centered(signRowSeparator, gridSize));
      console.log(centered(signRow, gridSize));
      console.log(centered(bottomRow, gridSize));
    });
  };

  private renderMove = (gameResponse: GameResponse) => {
    console.clear();
    console.log(`\n${centered(pc.bgBlue(this.gameTitle))}\n`);
    this.renderGrid(gameResponse.grid);
    console.log(`\n${centered(gameResponse.msg, this.gameTitle)}\n`);
    console.log(`\n${centered(`Your turn, player ${gameResponse.nextPlayer}`, this.gameTitle)}\n`);
    return gameResponse;
  };
}

// Start CLI
await main();
