"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AriesCreateProfileTool = void 0;
const tools_1 = require("langchain/tools");
class AriesCreateProfileTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aries_create_profile";
        this.description = `this tool can be used to create a profile in Aries
    `;
    }
    async _call() {
        try {
            const createProfileTransactionHash = await this.agent.createAriesProfile();
            return JSON.stringify({
                status: "success",
                createProfileTransactionHash,
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
exports.AriesCreateProfileTool = AriesCreateProfileTool;
