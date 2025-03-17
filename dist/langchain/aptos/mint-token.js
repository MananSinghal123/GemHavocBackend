"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosMintTokenTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class AptosMintTokenTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_mint_token";
        this.description = `this tool can be used to create fungible asset to a recipient

if the recipient wants to receive the token and not send to anybody else, keep to blank

  Inputs ( input is a JSON string ):
  to: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)
  amount: number, eg 1 or 0.01 (required)
  mint: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)
  `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const mintDetail = await this.agent.getTokenDetails(parsedInput.mint);
            const recipient = ts_sdk_1.AccountAddress.from(parsedInput.to) || this.agent.account.getAddress();
            const mintTokenTransactionHash = await this.agent.mintToken(recipient, parsedInput.mint, parsedInput.amount);
            return JSON.stringify({
                status: "success",
                mintTokenTransactionHash,
                token: {
                    name: mintDetail.name || "APT",
                    decimals: 8,
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
exports.AptosMintTokenTool = AptosMintTokenTool;
