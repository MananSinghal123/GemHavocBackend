"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGetWinCountTool = void 0;
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class GameGetWinCountTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_win_count";
        this.description = `Get the number of times a player has won the game on Aptos blockchain
  This tool returns the win count for a specific player address.
  Inputs (input is a JSON string):
  player_addr: string, eg "0x123abc..." (required) - The player's address on Aptos blockchain`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const player_addr = parsedInput.player_addr;
            if (!player_addr) {
                return JSON.stringify({
                    status: "error",
                    message: "player_addr is required",
                    code: "MISSING_PLAYER_ADDRESS"
                });
            }
            const winCount = await this.agent.getWinCount(player_addr);
            return JSON.stringify({
                status: "success",
                winCount,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.GameGetWinCountTool = GameGetWinCountTool;
