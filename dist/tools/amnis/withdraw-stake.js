"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unstakeTokens = unstakeTokens;
/**
 * Unstake APT or any tokens on Amnis
 * @param agent MoveAgentKit instance
 * @param to Recipient's public key
 * @param amount Amount to unstake
 * @returns Transaction signature
 */
async function unstakeTokens(agent, to, amount) {
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a::router::unstake_entry",
                functionArguments: [amount, to.toString()],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Token unstaking failed");
            throw new Error("Token unstaking failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Token unstaking failed: ${error.message}`);
    }
}
