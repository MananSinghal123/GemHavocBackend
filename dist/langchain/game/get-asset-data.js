"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGetAssetDataTool = void 0;
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class GameGetAssetDataTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_asset_data";
        this.description = `Get detailed information about a fungible asset named GH on Aptos blockchain
  This tool returns comprehensive data about a fungible asset including:
  - Metadata (name, symbol, decimals)
  - Maximum and current supply
  - User's balance and mint allocation
  - Mint status
  
  Inputs (input is a JSON string):
  fa_address: string, eg "0xabcdef..." (required) - The fungible asset address
  user_address: string, eg "0x123456..." (optional) - The user's address to get balance information`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const fa_address = parsedInput.fa_address;
            const user_address = parsedInput.user_address || "";
            if (!fa_address) {
                return JSON.stringify({
                    status: "error",
                    message: "fa_address is required",
                    code: "MISSING_ASSET_ADDRESS"
                });
            }
            const assetData = await this.agent.getAssetData(user_address);
            if (!assetData) {
                return JSON.stringify({
                    status: "error",
                    message: "Asset not found",
                    code: "ASSET_NOT_FOUND"
                });
            }
            return JSON.stringify({
                status: "success",
                assetData,
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
exports.GameGetAssetDataTool = GameGetAssetDataTool;
