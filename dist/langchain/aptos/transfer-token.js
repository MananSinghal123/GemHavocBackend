"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosTransferTokenTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class AptosTransferTokenTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_transfer_token";
        this.description = `this tool can be used to transfer APT, any token or fungible asset to a recipient

  if you want to transfer APT, mint will be "0x1::aptos_coin::AptosCoin"
  if you want to transfer token other than APT, you need to provide the mint of that specific token
  if you want to transfer fungible asset, add fungible asset address as mint

  keep to blank if user themselves wants to receive the token and not send to anybody else

  Inputs ( input is a JSON string ):
  to: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (optional)
  amount: number, eg 1 or 0.01 (required)
  mint: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" 
  or "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const mintDetail = await this.agent.getTokenDetails(parsedInput.mint);
            const recipient = ts_sdk_1.AccountAddress.from(parsedInput.to) || this.agent.account.getAddress();
            const transferTokenTransactionHash = await this.agent.transferTokens(recipient, (0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.amount, mintDetail.decimals || 6), parsedInput.mint);
            return JSON.stringify({
                status: "success",
                transferTokenTransactionHash,
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
exports.AptosTransferTokenTool = AptosTransferTokenTool;
