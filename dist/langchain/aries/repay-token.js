"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AriesRepayTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const utils_1 = require("../../utils");
class AriesRepayTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aries_repay";
        this.description = `this tool can be used to repay tokens in Aries

    if you want to repay APT, mintType will be "0x1::aptos_coin::AptosCoin"

    Inputs ( input is a JSON string ):
    mintType: string, eg "0x1::aptos_coin::AptosCoin" (required)
    amount: number, eg 1 or 0.01 (required)
    `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, utils_1.parseJson)(input);
            const mintDetail = await this.agent.getTokenDetails(parsedInput.mint);
            const repayTokenTransactionHash = await this.agent.repayAriesToken(parsedInput.mintType, (0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.amount, mintDetail.decimals || 8));
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
exports.AriesRepayTool = AriesRepayTool;
