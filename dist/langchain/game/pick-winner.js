"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosPickWinnerTool = void 0;
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class AptosPickWinnerTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_pick_winner";
        this.description = `this tool can be used to pick a winner for a specific asset type

  Inputs ( input is a JSON string ):
  assetType: string, the asset type for which to pick a winner (required)
  `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const pickWinnerResult = await this.agent.pickWinner(parsedInput.assetType);
            return JSON.stringify({
                status: "success",
                transactionHash: pickWinnerResult.hash,
                winner: pickWinnerResult.winner
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
exports.AptosPickWinnerTool = AptosPickWinnerTool;
