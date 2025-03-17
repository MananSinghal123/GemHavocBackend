"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePlaceBetTool = void 0;
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class GamePlaceBetTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_place_bet";
        this.description = `this tool can be used to place a bet with a specific asset type and amount

  Inputs ( input is a JSON string ):
  amount: string, the amount to bet (required)
  `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const placeBetResult = await this.agent.placeBet(parsedInput.amount);
            return JSON.stringify({
                status: "success",
                transactionHash: placeBetResult.hash,
                betDetails: {
                    assetType: parsedInput.assetType,
                    amount: parsedInput.amount,
                }
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
exports.GamePlaceBetTool = GamePlaceBetTool;
