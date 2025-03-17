"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintMODWithThala = mintMODWithThala;
/**
 * Mint Move Dollar in Thala
 * @param agent MoveAgentKit instance
 * @param mintType Type of coin to mint MOD with
 * @param amount Amount to mint
 * @returns Transaction signature
 */
async function mintMODWithThala(agent, mintType, amount) {
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: "0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::psm_scripts::mint",
                typeArguments: [mintType],
                functionArguments: [amount],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Mint MOD failed");
            throw new Error("Mint MOD failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Mint MOD failed: ${error.message}`);
    }
}
