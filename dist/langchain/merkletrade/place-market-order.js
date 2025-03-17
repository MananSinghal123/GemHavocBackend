"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerkleTradePlaceMarketOrderTool = void 0;
const tools_1 = require("langchain/tools");
const utils_1 = require("../../utils");
class MerkleTradePlaceMarketOrderTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "merkle_trade_place_market_order";
        this.description = `this tool can be used to place market order on MerkleTrade

  if you want to place a market order to buy BTC, pair will be "BTC_USD" and isLong will be true, 
  if you want to place a market order to sell BTC, pair will be "BTC_USD" and isLong will be false
  if you want to place a market order to size 100, collateral 10, sizeDelta will be 100, collateralDelta will be 10

	Inputs ( input is a JSON string ):
	pair: string, eg "BTC_USD" (required)
	isLong: boolean, eg true (required)
	sizeDelta: number, eg 10 (required)
	collateralDelta: number, eg 10 (required)
	`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, utils_1.parseJson)(input);
            const txhash = await this.agent.placeMarketOrderWithMerkleTrade(parsedInput.pair, parsedInput.isLong, parsedInput.sizeDelta, parsedInput.collateralDelta);
            return JSON.stringify({
                status: "success",
                marketOrderTransactionHash: txhash,
                position: {
                    pair: parsedInput.pair,
                    isLong: parsedInput.isLong,
                    sizeDelta: parsedInput.sizeDelta,
                    collateralDelta: parsedInput.collateralDelta,
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
exports.MerkleTradePlaceMarketOrderTool = MerkleTradePlaceMarketOrderTool;
