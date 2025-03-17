"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPosition = getUserPosition;
/**
 * Get details about a user's position
 * @param agent MoveAgentKit instance
 * @param userAddress The address of the user
 * @param positionId The ID of the position to query
 * @returns Position details
 * @example
 * ```ts
 * const positionDetails = await getUserPosition(agent, userAddress, positionId);
 * ```
 */
async function getUserPosition(agent, userAddress, positionId) {
    try {
        const transaction = await agent.aptos.view({
            payload: {
                function: "0x2fe576faa841347a9b1b32c869685deb75a15e3f62dfe37cbd6d52cc403a16f6::pool::user_position_details",
                functionArguments: [userAddress.toString(), positionId],
            },
        });
        if (!transaction) {
            throw new Error("Failed to fetch user position");
        }
        return transaction;
    }
    catch (error) {
        throw new Error(`Failed to get user position: ${error.message}`);
    }
}
