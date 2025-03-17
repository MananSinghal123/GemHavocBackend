"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPositionsWithMerkleTrade = getPositionsWithMerkleTrade;
const ts_sdk_1 = require("@merkletrade/ts-sdk");
/**
 * Get positions from MerkleTrade
 * @param agent MoveAgentKit instance
 * @returns Positions
 */
async function getPositionsWithMerkleTrade(agent) {
    try {
        const merkle = new ts_sdk_1.MerkleClient(await ts_sdk_1.MerkleClientConfig.mainnet());
        const positions = await merkle.getPositions({
            address: agent.account.getAddress().toString(),
        });
        const humanReadablePositions = positions.map((position) => ({
            ...position,
            size: (0, ts_sdk_1.toNumber)(position.size, 6),
            collateral: (0, ts_sdk_1.toNumber)(position.collateral, 6),
            avgPrice: (0, ts_sdk_1.toNumber)(position.avgPrice, 10),
            stopLossTriggerPrice: (0, ts_sdk_1.toNumber)(position.stopLossTriggerPrice, 10),
            takeProfitTriggerPrice: (0, ts_sdk_1.toNumber)(position.takeProfitTriggerPrice, 10),
        }));
        return humanReadablePositions;
    }
    catch (error) {
        throw new Error(`Get positions failed: ${error.message}`);
    }
}
