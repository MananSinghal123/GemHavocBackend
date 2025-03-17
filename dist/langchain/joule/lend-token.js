"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JouleLendTokenTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class JouleLendTokenTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "joule_lend_token";
        this.description = `this tool can be used to lend APT, tokens or fungible asset to a position

  if you want to lend APT, mint will be "0x1::aptos_coin::AptosCoin"
  if you want to lend token other than APT, you need to provide the mint of that specific token
  if you want to lend fungible asset, add "0x1::aptos_coin::AptosCoin" as mint and provide fungible asset address

  if positionId is not provided, the positionId will be 1234 and newPosition should be true
  
  Inputs ( input is a JSON string ):
  amount: number, eg 1 or 0.01 (required)
  mint: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" (required)
  positionId: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)
  newPosition: boolean, (required)  
  `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const mintDetail = await this.agent.getTokenDetails(parsedInput.mint);
            const fungibleAsset = mintDetail.faAddress.toLowerCase() === parsedInput.mint.toLowerCase();
            const lendTokenTransactionHash = await this.agent.lendToken((0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.amount, mintDetail.decimals || 8), parsedInput.mint, parsedInput.positionId, parsedInput.newPosition, fungibleAsset);
            return JSON.stringify({
                status: "success",
                lendTokenTransactionHash,
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
exports.JouleLendTokenTool = JouleLendTokenTool;
