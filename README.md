# Small games

Collection of small games written for fun.  
The games are written as packages that can be wrapped by an API.
(Game control logic is left to the API/UI.)

Currently available is a CLI interface to play the games.

## Currently supported games

- Tic-Tac-Toe (`./packages/tic-tac-toe`)
- Othello (`./packages/othello`)

## Playing

1. Clone repository
2. Run `pnpm install`
3. If in the root of the repository, `pnpm start:cli`
   - Alternatively in `./packages/cli` run `pnpm start`

## Developing

The project uses `pnpm` and `pnpm workspaces`.

1. Clone repository
2. Run `pnpm install` in repository root
3. In package that you want to modify, check `package.json` for available scripts
4. Write tests for changed/added features
   - (currently a little of in-source for unit tests & integration tests as `*.test.ts` file)
5. Update implementation respectively
6. Update build `pnpm build`
