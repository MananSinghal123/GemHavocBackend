"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosBalanceTool = void 0;
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class AptosBalanceTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "aptos_balance";
        this.description = `Get the balance of a Aptos account.

  If you want to get the balance of your wallet, you don't need to provide the mint.
  If no mint is provided, the balance will be in APT.
  if you want to get balance of a fungible asset, you need to provide the asset address as mint

  Inputs ( input is a JSON string ):
  mint: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" or "
  0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b" (optional).`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const mint = parsedInput.mint || undefined;
            // const mintDetails: any = this.agent.getTokenDetails(mint)
            const balance = await this.agent.getBalance(mint);
            return JSON.stringify({
                status: "success",
                balance,
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
exports.AptosBalanceTool = AptosBalanceTool;
