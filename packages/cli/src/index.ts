import { select } from "@inquirer/prompts";
import pc from "picocolors";


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
      console.log("tic-tac-toe");
      break;
  }

  console.log("Thanks for playing!");
  process.exit(0);
};

// Start CLI
await main();
