import { select } from "@inquirer/prompts";
import pc from "picocolors";

import { TicTacToe } from "./cliTicTacToe.js";
import { Othello } from "./cliOthello.js";

type Choice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  disabled?: boolean | string;
};

const gameChoices: Choice<number>[] = [
  { value: 1, name: "Tic-Tac-Toe" },
  { value: 2, name: "Othello" },
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
    case 2:
      await new Othello().play();
      break;
  }

  console.log("Thanks for playing!");
  process.exit(0);
};

await main();
