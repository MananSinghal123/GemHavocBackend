"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawAriesToken = withdrawAriesToken;
/**
 * Withdraw tokens from Aries
 * @param agent MoveAgentKit instance
 * @param mintType Type of coin to withdraw
 * @param amount Amount to withdraw
 * @returns Transaction signature
 */
async function withdrawAriesToken(agent, mintType, amount) {
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3::controller::withdraw",
                typeArguments: [mintType],
                functionArguments: ["Main account", amount, false],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Withdraw failed");
            throw new Error("Withdraw failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Withdraw failed: ${error.message}`);
    }
}
