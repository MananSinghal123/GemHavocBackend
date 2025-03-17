"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.burnNFT = burnNFT;
/**
 * Burn NFT
 * @param agent MoveAgentKit instance
 * @param mint NFT mint address
 * @returns Transaction signature
 */
async function burnNFT(agent, mint) {
    return "";
    //  try {
    //    const transaction = await agent.aptos.burnDigitalAssetTransaction({
    //      creator: agent.account.getAccount(),
    //      digitalAssetAddress: mint,
    //    });
    //    const committedTransactionHash = await agent.account.sendTransaction(transaction);
    //    const signedTransaction = await agent.aptos.waitForTransaction({
    //      transactionHash: committedTransactionHash,
    //    });
    //    if (!signedTransaction.success) {
    //      console.error(signedTransaction, "NFT burn failed");
    //      throw new Error("NFT burn failed");
    //    }
    //    return signedTransaction.hash;
    //  } catch (error: any) {
    //    throw new Error(`NFT burn failed: ${error.message}`);
    //  }
}
