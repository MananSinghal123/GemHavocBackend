"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
/**
 * Create a fungible asset token
 * @param agent MoveAgentKit instance
 * @param name Name of the token
 * @param symbol Symbol of the token
 * @param iconURI URI of the token icon
 * @param projectURI URI of the token project
 */
async function createToken(agent, name, symbol, iconURI, projectURI) {
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: "0x67c8564aee3799e9ac669553fdef3a3828d4626f24786b6a5642152fa09469dd::launchpad::create_fa_simple",
                functionArguments: [name, symbol, iconURI, projectURI],
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Token creation failed");
            throw new Error("Token creation failed");
        }
        return {
            hash: signedTransaction.hash,
            // @ts-ignore
            token: signedTransaction.events[0].data.fa_obj.inner,
        };
    }
    catch (error) {
        throw new Error(`Token creation failed: ${error.message}`);
    }
}
