"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowTokenWithEchelon = borrowTokenWithEchelon;
/**
 * Borrow tokens from Echelon
 * @param agent MoveAgentKit instance
 * @param mintType Type of coin to lend
 * @param amount Amount to lend
 * @param poolAddress Pool address
 * @param fungibleAsset Whether the asset is fungible
 * @returns Transaction signature
 */
async function borrowTokenWithEchelon(agent, mintType, amount, poolAddress, fungibleAsset) {
    const FUNCTIONAL_ARGS_DATA = [poolAddress, amount];
    const COIN_STANDARD_DATA = {
        function: "0xc6bc659f1649553c1a3fa05d9727433dc03843baac29473c817d06d39e7621ba::scripts::borrow",
        typeArguments: [mintType.toString()],
        functionArguments: FUNCTIONAL_ARGS_DATA,
    };
    const FUNGIBLE_ASSET_DATA = {
        function: "0xc6bc659f1649553c1a3fa05d9727433dc03843baac29473c817d06d39e7621ba::scripts::borrow_fa",
        functionArguments: FUNCTIONAL_ARGS_DATA,
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
            console.error(signedTransaction, "Borrow failed");
            throw new Error("Borrow failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Borrow failed: ${error.message}`);
    }
}
