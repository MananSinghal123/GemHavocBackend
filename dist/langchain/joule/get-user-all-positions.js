"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JouleGetUserAllPositions = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const __1 = require("../..");
const get_pool_address_by_token_name_1 = require("../../utils/get-pool-address-by-token-name");
class JouleGetUserAllPositions extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "joule_get_user_all_positions";
        this.description = `the tool can be used to get details about a user's all positions

	keep userAddress blank if user wants to get their own position or didn't provide any other user's address

  Inputs ( input is a JSON string ):
     userAddress: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (optional)
  `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const userAddress = ts_sdk_1.AccountAddress.from(parsedInput.userAddress) || this.agent.account.getAddress();
            const jouleUserAllPositions = await this.agent.getUserAllPositions(userAddress);
            return JSON.stringify({
                status: "success",
                jouleUserAllPositions,
                tokens: get_pool_address_by_token_name_1.tokensList.map((token) => {
                    return {
                        name: token.name,
                        decimals: token.decimals,
                        tokenAddress: token.tokenAddress,
                    };
                }),
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
exports.JouleGetUserAllPositions = JouleGetUserAllPositions;
