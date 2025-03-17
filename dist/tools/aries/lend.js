"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lendAriesToken = lendAriesToken;
/**
 * Lend tokens in Aries
 * @param agent MoveAgentKit instance
 * @param mintType Type of coin to lend
 * @param amount Amount to lend
 * @returns Transaction signature
 */
async function lendAriesToken(agent, mintType, amount) {
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3::controller::deposit",
                typeArguments: [mintType],
                functionArguments: ["Main account", amount, false],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Lend failed");
            throw new Error("Lend failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Lend failed: ${error.message}`);
    }
}
