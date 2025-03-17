"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosAccountAddressTool = void 0;
const tools_1 = require("langchain/tools");
class AptosAccountAddressTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_get_wallet_address";
        this.description = "Get the wallet address of the agent";
    }
    async _call(_input) {
        return this.agent.account.getAddress().toString();
    }
}
exports.AptosAccountAddressTool = AptosAccountAddressTool;
