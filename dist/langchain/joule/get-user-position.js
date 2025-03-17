"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JouleGetUserPosition = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const __1 = require("../..");
class JouleGetUserPosition extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "joule_get_user_position";
        this.description = `the tool can be used to get details about a user's position

	keep userAddress blank if user wants to get their own position or didn't provide any other user's address

	ask user to provide positionId from the list of positions they have if they want to get details about a specific position.
	do not fill random positionId if the user didn't provide any positionId

  Inputs ( input is a JSON string ):
     userAddress: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (optional)
     positionId: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)
  `;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            const userAddress = ts_sdk_1.AccountAddress.from(parsedInput.userAddress) || this.agent.account.getAddress();
            const jouleUserPosition = await this.agent.getUserPosition(userAddress, parsedInput.positionId);
            return JSON.stringify({
                status: "success",
                jouleUserPosition,
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
exports.JouleGetUserPosition = JouleGetUserPosition;
