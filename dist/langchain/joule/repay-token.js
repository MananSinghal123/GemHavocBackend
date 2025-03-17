"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JouleRepayTokenTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class JouleRepayTokenTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "joule_repay_token";
        this.description = `this tool can be used to repay APT, tokens or fungible asset from a position

  if you want to repay APT, mint will be "0x1::aptos_coin::AptosCoin"
  if you want to repay token other than APT, you need to provide the mint of that specific token
  if you want to repay fungible asset, add "0x1::aptos_coin::AptosCoin" as mint and provide fungible asset address
  
  Inputs ( input is a JSON string ):
  amount: number, eg 1 or 0.01 (required)
  mint: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" (required)
  positionId: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)
  fungibleAssetAddress: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (optional)
  `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const mintDetail = await this.agent.getTokenDetails(parsedInput.mint);
            const repayTokenTransactionHash = await this.agent.repayToken((0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.amount, mintDetail.decimals || 8), parsedInput.mint, parsedInput.positionId, parsedInput.fungibleAssetAddress);
            return JSON.stringify({
                status: "success",
                repayTokenTransactionHash,
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
exports.JouleRepayTokenTool = JouleRepayTokenTool;
