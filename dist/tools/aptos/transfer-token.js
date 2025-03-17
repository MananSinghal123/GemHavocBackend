"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferTokens = transferTokens;
/**
 * Transfer APT, tokens or fungible asset to a recipient
 * @param agent MoveAgentKit instance
 * @param to Recipient's public key
 * @param amount Amount to transfer
 * @param mint Move struct ID or address of the token / fungible asset to transfer
 * @returns Transaction signature
 * @example
 * ```ts
 * const transactionHash = await transferTokens(agent, recipientAddress, amount, APTOS_COIN); // For APT
 * const otherTransactionHash = await transferTokens(agent, recipientAddress, amount, OTHER_TOKEN); // For another token
 * const fungibleAssetTransactionHash = await transferTokens(agent, recipientAddress, amount, fungibleAssetAddress); // For fungible asset
 * ```
 */
async function transferTokens(agent, to, amount, mint) {
    const COIN_STANDARD_DATA = {
        function: "0x1::coin::transfer",
        typeArguments: [mint],
        functionArguments: [to.toString(), amount],
    };
    const FUNGIBLE_ASSET_DATA = {
        function: "0x1::primary_fungible_store::transfer",
        typeArguments: ["0x1::fungible_asset::Metadata"],
        functionArguments: [mint, to.toString(), amount],
    };
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: mint.split("::").length === 3 ? COIN_STANDARD_DATA : FUNGIBLE_ASSET_DATA,
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Token transfer failed");
            throw new Error("Token transfer failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Token transfer failed: ${error.message}`);
    }
}
