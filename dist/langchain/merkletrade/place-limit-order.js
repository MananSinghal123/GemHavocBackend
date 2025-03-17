"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerkleTradePlaceLimitOrderTool = void 0;
const tools_1 = require("langchain/tools");
const utils_1 = require("../../utils");
class MerkleTradePlaceLimitOrderTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "merkle_trade_place_limit_order";
        this.description = `this tool can be used to place limit order on MerkleTrade

  if you want to place a limit order to buy BTC at 100000, pair will be "BTC_USD" and isLong will be true, price will be 100000
  
	Inputs ( input is a JSON string ):
	pair: string, eg "BTC_USD" (required)
	isLong: boolean, eg true (required)
	sizeDelta: number, eg 10 (required)
	collateralDelta: number, eg 10 (required)
	price: number, eg 10000 (required)
	`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, utils_1.parseJson)(input);
            const txhash = await this.agent.placeLimitOrderWithMerkleTrade(parsedInput.pair, parsedInput.isLong, parsedInput.sizeDelta, parsedInput.collateralDelta, parsedInput.price);
            return JSON.stringify({
                status: "success",
                limitOrderTransactionHash: txhash,
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
exports.MerkleTradePlaceLimitOrderTool = MerkleTradePlaceLimitOrderTool;
