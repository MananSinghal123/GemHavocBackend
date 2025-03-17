"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosCreateTokenTool = void 0;
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class AptosCreateTokenTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_create_token";
        this.description = `this tool can be used to create fungible asset to a recipient

  Inputs ( input is a JSON string ):
  name: string, eg "USDT" (required)
  symbol: string, eg "USDT" (required)
  iconURI: string, eg "https://example.com/icon.png" (required)
  projectURI: string, eg "https://example.com/project" (required)
  `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const createTokenTransactionHash = await this.agent.createToken(parsedInput.name, parsedInput.symbol, parsedInput.iconURI, parsedInput.projectURI);
            return JSON.stringify({
                status: "success",
                createTokenTransactionHash,
                token: {
                    name: parsedInput.name,
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
exports.AptosCreateTokenTool = AptosCreateTokenTool;
