"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosBurnNFTTool = void 0;
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class AptosBurnNFTTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_burn_nft";
        this.description = `this tool can be used to burn any NFT on aptos

  Inputs ( input is a JSON string ):
  mint: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const transfer = await this.agent.burnNFT(parsedInput.mint);
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
exports.AptosBurnNFTTool = AptosBurnNFTTool;
