"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerkleTradeGetPositionTool = void 0;
const tools_1 = require("langchain/tools");
class MerkleTradeGetPositionTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "merkle_trade_get_position";
        this.description = `this tool can be used to get position on MerkleTrade
    No inputs required, this tool will return the current position of the agent
  `;
    }
    async _call() {
        try {
            const position = await this.agent.getPositionsWithMerkleTrade();
            return JSON.stringify({
                status: "success",
                position: position,
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
exports.MerkleTradeGetPositionTool = MerkleTradeGetPositionTool;
