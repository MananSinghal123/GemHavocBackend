"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JouleGetPoolDetails = void 0;
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class JouleGetPoolDetails extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "joule_get_pool_details";
        this.description = `the tool can be used to get a token / fungible asset pool details

  Inputs ( input is a JSON string ):
     mint: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" (required)

  Example: '{"mint": "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT"}'
  `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const pool = await this.agent.getPoolDetails(parsedInput.mint);
            return JSON.stringify({
                status: "success",
                pool,
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
exports.JouleGetPoolDetails = JouleGetPoolDetails;
