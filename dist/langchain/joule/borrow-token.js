"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JouleBorrowTokenTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class JouleBorrowTokenTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "joule_borrow_token";
        this.description = `this tool can be used to borrow APT, tokens or fungible asset from a position

  if you want to borrow APT, mint will be "0x1::aptos_coin::AptosCoin"
  if you want to borrow token other than APT, you need to provide the mint of that specific token
  if you want to borrow fungible asset, add "0x1::aptos_coin::AptosCoin" as mint and provide fungible asset address
  
  Inputs ( input is a JSON string ):
  amount: number, eg 1 or 0.01 (required)
  mint: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" (required)
  positionId: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)
  `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const mintDetail = await this.agent.getTokenDetails(parsedInput.mint);
            const fungibleAsset = mintDetail.faAddress.toLowerCase() === parsedInput.mint.toLowerCase();
            const borrowTokenTransactionHash = await this.agent.borrowToken((0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.amount, mintDetail.decimals || 8), parsedInput.mint, parsedInput.positionId, fungibleAsset);
            return JSON.stringify({
                status: "success",
                borrowTokenTransactionHash,
                token: {
                    name: mintDetail.name || "APT",
                    decimals: mintDetail.decimals || 8,
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
exports.JouleBorrowTokenTool = JouleBorrowTokenTool;
