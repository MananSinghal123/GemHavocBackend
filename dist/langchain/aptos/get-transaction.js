"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosTransactionTool = void 0;
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class AptosTransactionTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_get_transaction";
        this.description = `Fetches a transaction from aptos blockchain

  Inputs ( input is a JSON string ):
  transactionHash: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const aptosTransaction = await this.agent.getTransaction(parsedInput.transactionHash);
            return JSON.stringify({
                status: "success",
                aptosTransaction,
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
exports.AptosTransactionTool = AptosTransactionTool;
