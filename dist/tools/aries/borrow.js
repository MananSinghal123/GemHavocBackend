"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowAriesToken = borrowAriesToken;
/**
 * Borrow tokens from Aries
 * @param agent MoveAgentKit instance
 * @param mintType Type of coin to borrow
 * @param amount Amount to borrow
 * @returns Transaction signature
 */
async function borrowAriesToken(agent, mintType, amount) {
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3::controller::withdraw",
                typeArguments: [mintType],
                functionArguments: ["Main account", amount, true],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Borrow failed");
            throw new Error("Borrow failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Borrow failed: ${error.message}`);
    }
}
