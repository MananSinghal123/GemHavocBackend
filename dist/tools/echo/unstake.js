"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unstakeTokenWithEcho = unstakeTokenWithEcho;
/**
 * Unstake tokens in Echo
 * @param agent MoveAgentKit instance
 * @param amount Amount of APT to unstake
 * @returns Transaction signature
 */
async function unstakeTokenWithEcho(agent, amount) {
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: "0xa0281660ff6ca6c1b68b55fcb9b213c2276f90ad007ad27fd003cf2f3478e96e::lsdmanage::unstake",
                functionArguments: [amount],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Unstake token in Echo failed");
            throw new Error("Unstake token in Echo failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Unstake token in Echo failed: ${error.message}`);
    }
}
