"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unstakeAPTWithThala = unstakeAPTWithThala;
/**
 * Unstake tokens in Thala
 * @param agent MoveAgentKit instance
 * @param amount Amount of APT to unstake
 * @returns Transaction signature
 */
async function unstakeAPTWithThala(agent, amount) {
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6::scripts::unstake_thAPT",
                functionArguments: [amount],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Unstake token failed");
            throw new Error("Unstake token failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Unstake token failed: ${error.message}`);
    }
}
