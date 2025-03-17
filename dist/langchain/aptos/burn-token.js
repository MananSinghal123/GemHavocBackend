"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosBurnTokenTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class AptosBurnTokenTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_burn_token";
        this.description = `this tool can be used to burn a fungible asset

  Inputs ( input is a JSON string ):
  amount: number, eg 1 or 0.01 (required) 
  mint: string, "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const mintDetail = await this.agent.getTokenDetails(parsedInput.mint);
            const burnTransactionHash = await this.agent.burnToken((0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.amount, mintDetail.decimals || 8), parsedInput.mint);
            return JSON.stringify({
                status: "success",
                burnTransactionHash,
                token: {
                    name: mintDetail.name,
                    decimals: mintDetail.decimals,
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
exports.AptosBurnTokenTool = AptosBurnTokenTool;
