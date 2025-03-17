"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePositionWithMerkleTrade = closePositionWithMerkleTrade;
const ts_sdk_1 = require("@merkletrade/ts-sdk");
const error_1 = require("./error");
/**
 * Close position on MerkleTrade
 * @param agent MoveAgentKit instance
 * @param pair Pair ID, e.g. "BTC_USD"
 * @param isLong True for long, false for short
 * @returns Transaction signature
 */
async function closePositionWithMerkleTrade(agent, pair, isLong) {
    try {
        const merkle = new ts_sdk_1.MerkleClient(await ts_sdk_1.MerkleClientConfig.mainnet());
        const positions = await merkle.getPositions({
            address: agent.account.getAddress().toString(),
        });
        const position = positions.find((position) => position.pairType === pair && position.isLong === isLong);
        if (!position) {
            throw new error_1.PositionNotFoundError(pair, isLong, "Position not found");
        }
        const payload = merkle.payloads.placeMarketOrder({
            pair: pair,
            userAddress: agent.account.getAddress(),
            sizeDelta: position.size,
            collateralDelta: position.collateral,
            isLong: position.isLong,
            isIncrease: false,
        });
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: payload,
        });
        const txhash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: txhash,
        });
        if (!signedTransaction.success) {
            throw new error_1.FailedSendTransactionError("Close position failed", signedTransaction);
        }
        return signedTransaction.hash;
    }
    catch (error) {
        if (error instanceof error_1.MerkleBaseError) {
            throw error;
        }
        throw new Error(`Close position failed: ${error.message}`);
    }
}
