"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EchoUnstakeTokenTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const utils_1 = require("../../utils");
class EchoUnstakeTokenTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "echo_unstake_token";
        this.description = `this tool can be used to unstake token in Echo

    Inputs ( input is a JSON string ):
    amount: number, eg 1 or 0.01 (required)
    `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, utils_1.parseJson)(input);
            const unstakeTransactionHash = await this.agent.unstakeTokenWithEcho((0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.amount, 8));
            return JSON.stringify({
                status: "success",
                unstakeTransactionHash,
                token: {
                    name: "APT",
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
exports.EchoUnstakeTokenTool = EchoUnstakeTokenTool;
