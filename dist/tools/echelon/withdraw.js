"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawTokenWithEchelon = withdrawTokenWithEchelon;
/**
 * Withdraw tokens from Echelon
 * @param agent MoveAgentKit instance
 * @param mintType Type of coin to lend
 * @param amount Amount to lend
 * @param poolAddress Pool address
 * @param fungibleAsset Whether the asset is fungible
 * @returns Transaction signature
 */
async function withdrawTokenWithEchelon(agent, mintType, amount, poolAddress, fungibleAsset) {
    try {
        const FUNCTIONAL_ARGS_DATA = [poolAddress, amount];
        const COIN_STANDARD_DATA = {
            function: "0xc6bc659f1649553c1a3fa05d9727433dc03843baac29473c817d06d39e7621ba::scripts::withdraw",
            typeArguments: [mintType.toString()],
            functionArguments: FUNCTIONAL_ARGS_DATA,
        };
        const FUNGIBLE_ASSET_DATA = {
            function: "0xc6bc659f1649553c1a3fa05d9727433dc03843baac29473c817d06d39e7621ba::scripts::withdraw_fa",
            functionArguments: FUNCTIONAL_ARGS_DATA,
        };
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: fungibleAsset ? FUNGIBLE_ASSET_DATA : COIN_STANDARD_DATA,
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Withdraw failed");
            throw new Error("Withdraw failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Withdraw failed: ${error.message}`);
    }
}
