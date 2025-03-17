"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWinCount = getWinCount;
//import { AccountAddress, aptosClient } from "aptos"
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const aptosClient_1 = require("../../utils/aptosClient");
/**
 * Fetches the number of times a player has won the game
 * @param player_addr The address of the player to check
 * @returns The number of wins for the player
 * @example
 * ```ts
 * const winCount = await getWinCount({ player_addr: "0x123abc..." })
 * ```
 */
async function getWinCount(player_addr) {
    try {
        const MODULE_ADDRESS_TOKEN = process.env.MODULE_ADDRESS_TOKEN || "0x1";
        const winCount = await (0, aptosClient_1.aptosClient)().view({
            payload: {
                function: `${ts_sdk_1.AccountAddress.from(MODULE_ADDRESS_TOKEN)}::launchpad::get_win_count`,
                functionArguments: [MODULE_ADDRESS_TOKEN, player_addr],
            },
        });
        console.log(winCount);
        const winCountValue = winCount[0];
        if (winCountValue === undefined) {
            throw new Error("Win count is undefined");
        }
        return winCountValue;
    }
    catch (error) {
        throw new Error(`Failed to get win count: ${error.message}`);
    }
}
