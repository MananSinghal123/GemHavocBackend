"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransaction = getTransaction;
/**
 * Fetches transaction from aptos
 * @param agent MoveAgentKit instance
 * @param hash Transaction Hash
 * @returns Transaction signature
 * @example
 * ```ts
 * const transaction = await getTransaction(agent, "HASH")
 * ```
 */
async function getTransaction(agent, hash) {
    try {
        const transaction = await agent.aptos.getTransactionByHash({
            transactionHash: hash,
        });
        return transaction;
    }
    catch (error) {
        throw new Error(`Token transfer failed: ${error.message}`);
    }
}
