"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoolDetails = getPoolDetails;
/**
 * Get details about a specific pool
 * @param agent MoveAgentKit instance
 * @param mint The Move struct ID of the token to get details for
 * @returns Pool details
 * @example
 * ```ts
 * const poolDetails = await getPoolDetails(agent, "0x1::aptos_coin::AptosCoin"); // For APT pool
 * const otherPoolDetails = await getPoolDetails(agent, otherCoinAddress); // For other token pool
 * ```
 */
async function getPoolDetails(agent, mint) {
    try {
        const allPoolDetailsResponse = await fetch("https://price-api.joule.finance/api/market");
        const allPoolDetails = await allPoolDetailsResponse.json();
        const poolDetail = allPoolDetails.data.find((pool) => pool.asset.type.includes(mint));
        if (!poolDetail) {
            throw new Error("Pool not found");
        }
        return {
            assetName: poolDetail.asset.assetName,
            tokenAddress: mint,
            ltv: poolDetail.ltv,
            decimals: poolDetail.asset.decimals,
            marketSize: Number(poolDetail.marketSize) / poolDetail.asset.decimals,
            totalBorrowed: Number(poolDetail.totalBorrowed) / poolDetail.asset.decimals,
            depositApy: poolDetail.depositApy,
            extraDepositApy: poolDetail.extraAPY.depositAPY,
            borrowApy: poolDetail.borrowApy,
            price: poolDetail.priceInfo.price,
        };
    }
    catch (error) {
        throw new Error(`Failed to get pool details: ${error.message}`);
    }
}
