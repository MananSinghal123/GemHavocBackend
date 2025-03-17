"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repayAriesToken = repayAriesToken;
/**
 * Repay tokens in Aries
 * @param agent MoveAgentKit instance
 * @param mintType Type of coin to repay
 * @param amount Amount to repay
 * @returns Transaction signature
 */
async function repayAriesToken(agent, mintType, amount) {
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3::controller::deposit",
                typeArguments: [mintType],
                functionArguments: ["Main account", amount, true],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Repay failed");
            throw new Error("Repay failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Repay failed: ${error.message}`);
    }
}
