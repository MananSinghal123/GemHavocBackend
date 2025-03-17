"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmnisWithdrawStakeTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class AmnisWithdrawStakeTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "amnis_withdraw_stake";
        this.description = `this tool can be used to withdraw staked APT (Aptos) from amnis validator and receive back APT

	keep recipient blank if user themselves wants to receive APT and not send to anybody else

  Inputs ( input is a JSON string ):
  amount: number, eg 1 or 0.01 (required)
  recipient: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const recipient = ts_sdk_1.AccountAddress.from(parsedInput.recipient) || this.agent.account.getAddress();
            const withdrawStakeTransactionHash = await this.agent.withdrawStakeFromAmnis(recipient, (0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.amount, 8));
            return JSON.stringify({
                status: "success",
                withdrawStakeTransactionHash,
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
exports.AmnisWithdrawStakeTool = AmnisWithdrawStakeTool;
