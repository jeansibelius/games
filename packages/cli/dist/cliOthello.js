import pc from "picocolors";
import { coordinatePrompt } from "./coordinatePrompt.js";
import { addLeftPadding, getLeftPaddingToCenter } from "./utils.js";
import { initGame, playerMove } from "othello";
export class Othello {
    #gameTitle = "  Othello  ";
    #move = { x: 3, y: 3 };
    #latestMove;
    constructor() {
        this.#latestMove = initGame();
        this.renderMove();
    }
    play = async () => {
        while (!this.#latestMove.msg.includes("Winner") && !this.#latestMove.msg.includes("Tie")) {
            await this.#makeMove();
            this.#latestMove = playerMove(this.#latestMove.nextPlayer, this.#move);
            this.renderMove();
        }
    };
    #makeMove = async () => {
        await coordinatePrompt({
            message: "coordinates",
            default: JSON.stringify(this.#move),
            grid: this.#latestMove.grid,
            updateCoordinatesCallback: (coordinates) => {
                this.#move = coordinates;
                this.renderMove();
                return this.#move;
            },
        });
    };
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
                let value = colValue > 0 ? String(colValue) : " ";
                if (this.#move.y === rowNum && this.#move.x === colNum) {
                    const canPlace = value === " " &&
                        this.#latestMove.nextPossibleMoves.filter(({ x, y }) => x === colNum && y === rowNum).length === 1;
                    const cellColor = canPlace ? pc.bgGreen : pc.bgRed;
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
    renderMove = () => {
        console.clear();
        console.log(`\n${addLeftPadding(pc.bgBlue(this.#gameTitle), getLeftPaddingToCenter(this.#gameTitle))}\n`);
        this.#renderGrid();
        const NextMoveMsg = `\n${addLeftPadding(this.#latestMove.msg, getLeftPaddingToCenter(this.#latestMove.msg))}\n`;
        console.log(NextMoveMsg);
        const nextPlayerMsg = `Your turn, player ${this.#latestMove.nextPlayer}`;
        !this.#latestMove.msg.includes("Winner") &&
            console.log(`\n${addLeftPadding(nextPlayerMsg, getLeftPaddingToCenter(nextPlayerMsg, this.#gameTitle))}\n`);
        return this.#latestMove;
    };
}
