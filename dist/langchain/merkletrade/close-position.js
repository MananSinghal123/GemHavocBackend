"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerkleTradeClosePositionTool = void 0;
const tools_1 = require("langchain/tools");
const utils_1 = require("../../utils");
class MerkleTradeClosePositionTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "merkle_trade_close_position";
        this.description = `this tool can be used to close position on MerkleTrade

  if you want to close a position, pair will be "BTC_USD" and isLong will be true
  
	Inputs ( input is a JSON string ):
	pair: string, eg "BTC_USD" (required)
	isLong: boolean, eg true (required)
	`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, utils_1.parseJson)(input);
            const txhash = await this.agent.closePositionWithMerkleTrade(parsedInput.pair, parsedInput.isLong);
            return JSON.stringify({
                status: "success",
                closePositionTransactionHash: txhash,
                position: {
                    pair: parsedInput.pair,
                    isLong: parsedInput.isLong,
                    sizeDelta: parsedInput.sizeDelta,
                    collateralDelta: parsedInput.collateralDelta,
                    price: parsedInput.price,
                },
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
exports.MerkleTradeClosePositionTool = MerkleTradeClosePositionTool;
