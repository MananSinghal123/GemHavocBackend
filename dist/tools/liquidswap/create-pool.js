"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPool = createPool;
/**
 * Create a new pool in liquidswap
 * @param agent MoveAgentKit instance
 * @param mintX MoveStructId of the first token
 * @param mintY MoveStructId of the second token
 * @returns Transaction signature
 */
async function createPool(agent, mintX, mintY) {
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2::register_pool",
                typeArguments: [
                    mintX,
                    mintY,
                    "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated",
                ],
                functionArguments: [],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Create pool failed");
            throw new Error("Create pool failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Create pool failed: ${error.message}`);
    }
}
