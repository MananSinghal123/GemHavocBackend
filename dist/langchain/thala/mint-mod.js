"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThalaMintMODTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const utils_1 = require("../../utils");
class ThalaMintMODTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "thala_mint_mod";
        this.description = `this tool can be used to mint move dollar (MOD) in Thala

    Only supported coin types: lzUSDC, whUSDC, or USDt

	if the user coin is not in the list , default to lzUSDC

	mintType for lzUSDC - 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC
	mintType for wUSDC - 0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T
	mintType for USDt - 0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b

    Inputs ( input is a JSON string ):
    mintType: eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" (required)
    amount: number, eg 1 or 0.01 (required)
    `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, utils_1.parseJson)(input);
            const mintMODTransactionHash = await this.agent.mintMODWithThala(parsedInput.mintType, (0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.amount, 6));
            return JSON.stringify({
                status: "success",
                mintMODTransactionHash,
                token: {
                    name: "MOD",
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
exports.ThalaMintMODTool = ThalaMintMODTool;
