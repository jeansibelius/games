import { select } from "@inquirer/prompts";
import pc from "picocolors";
import { TicTacToe } from "./cliTicTacToe.js";
const gameChoices = [
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
await main();
