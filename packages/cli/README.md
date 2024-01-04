# Game CLI

Play included games on the command line.

## Development

The game backends are hooked into the client as classes that expose only a very limited API.
See for example [`cliTicTacToe`](./src/cliTicTacToe.ts).

## Key dependencies

- [`@inquirer`](https://github.com/SBoudrias/Inquirer.js)
  - Command line interface
  - Extended with a custom developed prompt [`coordinatePrompt`](./src/coordinatePrompt.ts) for moving the cursor in a grid
- [`picocolors`](https://github.com/alexeyraspopov/picocolors)
  - Colors for CLI made simple
