"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EchoStakeTokenTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class EchoStakeTokenTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "echo_stake_token";
        this.description = `this tool can be used to stake token in Echo

    Inputs ( input is a JSON string ):
    amount: number, eg 1 or 0.01 (required)
    `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const stakeTransactionHash = await this.agent.stakeTokenWithEcho((0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.amount, 8));
            return JSON.stringify({
                status: "success",
                stakeTransactionHash,
                token: {
                    name: "eAPT",
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
exports.EchoStakeTokenTool = EchoStakeTokenTool;
