"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeMarketOrderWithMerkleTrade = placeMarketOrderWithMerkleTrade;
const ts_sdk_1 = require("@merkletrade/ts-sdk");
const error_1 = require("./error");
/**
 * Place market order on MerkleTrade
 * @param agent MoveAgentKit instance
 * @param pair Pair ID, e.g. "BTC_USD"
 * @param isLong True for long, false for short
 * @param sizeDelta Amount of tokens to buy/sell (in USDC, 10 USDC = 10)
 * @param collateralDelta Amount of collateral to buy/sell (in USDC, 10 USDC = 10)
 * @returns Transaction signature
 */
async function placeMarketOrderWithMerkleTrade(agent, pair, isLong, sizeDelta, // in USDC
collateralDelta // in USDC
) {
    try {
        const merkle = new ts_sdk_1.MerkleClient(await ts_sdk_1.MerkleClientConfig.mainnet());
        const payload = merkle.payloads.placeMarketOrder({
            pair: pair,
            userAddress: agent.account.getAddress(),
            sizeDelta: (0, ts_sdk_1.fromNumber)(sizeDelta, 6),
            collateralDelta: (0, ts_sdk_1.fromNumber)(collateralDelta, 6),
            isLong: isLong,
            isIncrease: true,
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
            throw new error_1.FailedSendTransactionError("Place market order failed", signedTransaction);
        }
        return signedTransaction.hash;
    }
    catch (error) {
        if (error instanceof error_1.MerkleBaseError) {
            throw error;
        }
        throw new Error(`Place market order failed: ${error.message}`);
    }
}
