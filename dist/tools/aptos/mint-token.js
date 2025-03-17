"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintToken = mintToken;
/**
 * Mint a fungible asset token
 * @param agent MoveAgentKit instance
 * @param name Name of the token
 * @param symbol Symbol of the token
 * @param iconURI URI of the token icon
 * @param projectURI URI of the token project
 */
async function mintToken(agent, to, mint, amount) {
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: "0x67c8564aee3799e9ac669553fdef3a3828d4626f24786b6a5642152fa09469dd::launchpad::mint_to_address",
                functionArguments: [to.toString(), mint, amount],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Token mint failed");
            throw new Error("Token mint failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Token mint failed: ${error.message}`);
    }
}
