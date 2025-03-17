"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowToken = borrowToken;
/**
 * Borrow APT, tokens or fungible asset from a position
 * @param agent MoveAgentKit instance
 * @param amount Amount to mint
 * @param mint The Move struct ID of the token to borrow
 * @param positionId The position ID to borrow from
 * @param fungibleAsset boolean value for fungible asset
 * @returns Transaction signature and position ID
 * @example
 * ```ts
 * const transactionHash = await borrowToken(agent, amount, APTOS_COIN, positionId); // For APT
 * const otherTransactionHash = await borrowToken(agent, amount, OTHER_TOKEN, positionId); // For another token
 * const fungibleAssetTransactionHash = await borrowToken(agent, amount, APTOS_COIN, positionId, fungibleAssetAddress); // For fungible asset
 */
async function borrowToken(agent, amount, mint, positionId, fungibleAsset) {
    const pyth_update_data = await agent.getPythData();
    const DEFAULT_FUNCTIONAL_ARGS = [positionId, amount, pyth_update_data];
    const COIN_STANDARD_DATA = {
        function: "0x2fe576faa841347a9b1b32c869685deb75a15e3f62dfe37cbd6d52cc403a16f6::pool::borrow",
        typeArguments: [mint.toString()],
        functionArguments: DEFAULT_FUNCTIONAL_ARGS,
    };
    const FUNGIBLE_ASSET_DATA = {
        function: "0x2fe576faa841347a9b1b32c869685deb75a15e3f62dfe37cbd6d52cc403a16f6::pool::borrow_fa",
        functionArguments: [positionId, mint.toString(), amount, pyth_update_data],
    };
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: fungibleAsset ? FUNGIBLE_ASSET_DATA : COIN_STANDARD_DATA,
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Token borrow failed");
            throw new Error("Token borrow failed");
        }
        return {
            hash: signedTransaction.hash,
            positionId,
        };
    }
    catch (error) {
        throw new Error(`Token borrow failed: ${error.message}`);
    }
}
