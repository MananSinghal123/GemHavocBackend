"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosTransferNFTTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class AptosTransferNFTTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_transfer_nft";
        this.description = `this tool can be used to transfer any NFT on aptos to receipient

  Inputs ( input is a JSON string ):
  to: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)
  mint: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const transfer = await this.agent.transferNFT(ts_sdk_1.AccountAddress.from(parsedInput.to), parsedInput.mint);
            return JSON.stringify({
                status: "success",
                transfer,
                nft: parsedInput.mint,
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
exports.AptosTransferNFTTool = AptosTransferNFTTool;
