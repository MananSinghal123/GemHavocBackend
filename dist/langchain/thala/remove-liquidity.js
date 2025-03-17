"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThalaRemoveLiquidityTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const utils_1 = require("../../utils");
class ThalaRemoveLiquidityTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "thala_remove_liquidity";
        this.description = `this tool can be used to remove liquidity from a Thala pool

    If one of your coins is APT, use "0x1::aptos_coin::AptosCoin" as the coin type

    Inputs ( input is a JSON string ):
    mintX: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" (required)
    mintY: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" (required)
    lpAmount: number, eg 1 or 0.01 (required)
    `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, utils_1.parseJson)(input);
            const mintXDetail = await this.agent.getTokenDetails(parsedInput.mintX);
            const mintYDetail = await this.agent.getTokenDetails(parsedInput.mintY);
            const removeLiquidityTransactionHash = await this.agent.removeLiquidityWithThala(parsedInput.mintX, parsedInput.mintY, (0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.lpAmount, 6));
            return JSON.stringify({
                status: "success",
                removeLiquidityTransactionHash,
                tokens: [
                    {
                        mintX: mintXDetail.name,
                        decimals: 6,
                    },
                    {
                        mintY: mintYDetail.name,
                        decimals: 6,
                    },
                ],
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
exports.ThalaRemoveLiquidityTool = ThalaRemoveLiquidityTool;
