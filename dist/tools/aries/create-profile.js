"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAriesProfile = createAriesProfile;
/**
 * Create a profile in Aries
 * @param agent MoveAgentKit instance
 * @returns Transaction signature
 */
async function createAriesProfile(agent) {
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3::controller::register_user",
                functionArguments: ["Main account"],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Create profile failed");
            throw new Error("Create profile failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Create profile failed: ${error.message}`);
    }
}
