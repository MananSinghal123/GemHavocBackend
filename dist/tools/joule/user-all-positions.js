"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAllPositions = getUserAllPositions;
const clean_joule_all_positions_list_1 = require("../../utils/clean-joule-all-positions-list");
/**
 * Get details about a user's all positions
 * @param agent MoveAgentKit instance
 * @param userAddress The address of the user
 * @returns List of user positions
 */
async function getUserAllPositions(agent, userAddress) {
    try {
        const transaction = await agent.aptos.view({
            payload: {
                function: "0x2fe576faa841347a9b1b32c869685deb75a15e3f62dfe37cbd6d52cc403a16f6::pool::user_positions_map",
                functionArguments: [userAddress.toString()],
            },
        });
        if (!transaction) {
            throw new Error("Failed to fetch user all positions");
        }
        // TODO : make the amounts human readable // sync with shivam for all view function
        const cleanedTransaction = (0, clean_joule_all_positions_list_1.removeLastInterestRateIndex)(transaction);
        return cleanedTransaction;
    }
    catch (error) {
        throw new Error(`Failed to get user all positions: ${error.message}`);
    }
}
