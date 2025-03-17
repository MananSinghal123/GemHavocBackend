"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickWinner = pickWinner;
/**
 * Pick a winner for a specific asset type
 * @param agent MoveAgentKit instance
 * @param assetType Asset type for which to pick a winner
 * @returns Transaction hash and winner information
 */
async function pickWinner(agent, assetType) {
    const MODULE_ADDRESS_TOKEN = process.env.MODULE_ADDRESS_TOKEN || "0x1";
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: `${MODULE_ADDRESS_TOKEN}::launchpad::pickWinner`,
                typeArguments: [],
                functionArguments: [assetType, 0],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Pick winner failed");
            throw new Error("Pick winner failed");
        }
        return {
            hash: signedTransaction.hash,
            winner: signedTransaction.events[0]?.data?.winner
        };
    }
    catch (error) {
        throw new Error(`Pick winner failed: ${error.message}`);
    }
}
