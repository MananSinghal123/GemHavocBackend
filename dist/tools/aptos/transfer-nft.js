"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferNFT = transferNFT;
/**
 * Transfer NFT
 * @param agent MoveAgentKit instance
 * @param to Recipient's public key
 * @param mint NFT mint address
 * @returns Transaction signature
 */
async function transferNFT(agent, // Replace with the actual type of the move-agent
to, mint) {
    return "";
    //  try {
    //    const transaction = await agent.aptos.transferDigitalAssetTransaction({
    //      sender: agent.account.getAccount(),
    //      digitalAssetAddress: mint,
    //      recipient: to,
    //    });
    //    const committedTransaction = await agent.aptos.signAndSubmitTransaction({
    //      signer: agent.account.getAccount(),
    //      transaction,
    //    });
    //    const signedTransaction = await agent.aptos.waitForTransaction({
    //      transactionHash: committedTransaction.hash,
    //    });
    //    if (!signedTransaction.success) {
    //      console.error(signedTransaction, "NFT transfer failed");
    //      throw new Error("NFT transfer failed");
    //    }
    //    return signedTransaction.hash;
    //  } catch (error: any) {
    //    throw new Error(`NFT transfer failed: ${error.message}`);
    //  }
}
