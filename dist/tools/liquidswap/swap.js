"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swap = swap;
/**
 * Swap tokens in liquidswap
 * @param agent MoveAgentKit instance
 * @param mintX MoveStructId of the token to swap from
 * @param mintY MoveStructId of the token to swap to
 * @param swapAmount Amount of tokens to swap
 * @param minCoinOut Minimum amount of tokens to receive (default 0)
 * @returns Transaction signature
 */
async function swap(agent, mintX, mintY, swapAmount, minCoinOut = 0) {
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2::swap",
                typeArguments: [
                    mintX,
                    mintY,
                    "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated",
                ],
                functionArguments: [swapAmount, minCoinOut],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Swap failed");
            throw new Error("Swap failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Swap failed: ${error.message}`);
    }
}
