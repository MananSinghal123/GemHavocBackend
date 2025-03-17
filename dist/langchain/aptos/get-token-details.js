"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosGetTokenDetailTool = void 0;
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class AptosGetTokenDetailTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_token_details";
        this.description = `Get the detail of any aptos tokens
	
  details also include decimals which you can use to make onchain values readable to a human user

  Inputs ( input is a JSON string ):
  token: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const mint = parsedInput.token || "";
            const tokenData = await this.agent.getTokenDetails(mint);
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
exports.AptosGetTokenDetailTool = AptosGetTokenDetailTool;
