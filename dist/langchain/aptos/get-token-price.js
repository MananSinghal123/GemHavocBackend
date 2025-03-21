"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosGetTokenPriceTool = void 0;
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class AptosGetTokenPriceTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_token_price";
        this.description = `Get the live price of any aptos tokens in USD.
	do not do any decimals conversion here, the price is already in USD

  details also include decimals which you can use to make onchain values readable to a human user

  Inputs ( input is a JSON string - this is IMPORTANT):
  token: string, eg usdt, btc etc.`;
    }
    async _call(input) {
        console.log("input", input);
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const token = parsedInput.token || input || "usdt";
            const tokenData = await this.agent.getTokenPrice(token);
            return JSON.stringify({
                status: "success",
                tokenData,
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
exports.AptosGetTokenPriceTool = AptosGetTokenPriceTool;
