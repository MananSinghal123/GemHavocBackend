"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetData = getAssetData;
const aptosClient_1 = require("../../utils/aptosClient");
const getMintEnabled_1 = require("../../utils/getMintEnabled");
const getUserMintBalance_1 = require("../../utils/getUserMintBalance");
const helpers_1 = require("../../utils/helpers");
/**
 * Fetches fungible asset data from the Aptos blockchain
 * @param fa_address The fungible asset address to fetch data for
 * @param user_address Optional user address to get balance information
 * @returns Asset data including supply, balances, and mint status
 * @example
 * ```ts
 * const assetData = await getAssetData({
 *   fa_address: "0xabcdef...",
 *   user_address: "0x123456..."
 * })
 * ```
 */
async function getAssetData(user_address) {
    try {
        const fa_address = process.env.FA_ADDRESS || "0x1";
        if (!fa_address)
            return null;
        const res = await (0, aptosClient_1.aptosClient)().queryIndexer({
            query: {
                variables: {
                    fa_address,
                    account: user_address || "",
                },
                query: `
        query FungibleQuery($fa_address: String, $account: String) {
          fungible_asset_metadata(where: {asset_type: {_eq: $fa_address}}) {
            maximum_v2
            supply_v2
            name
            symbol
            decimals
            asset_type
            icon_uri
          }
          current_fungible_asset_balances(
            where: {owner_address: {_eq: $account}, asset_type: {_eq: $fa_address}}
            distinct_on: asset_type
            limit: 1
          ) {
            amount
          }
        }`,
            },
        });
        const asset = res.fungible_asset_metadata[0];
        if (!asset)
            return null;
        const isMintEnabled = await (0, getMintEnabled_1.getMintEnabled)({ fa_address });
        return {
            asset,
            maxSupply: (0, helpers_1.convertAmountFromOnChainToHumanReadable)(asset.maximum_v2 ?? 0, asset.decimals),
            currentSupply: (0, helpers_1.convertAmountFromOnChainToHumanReadable)(asset.supply_v2 ?? 0, asset.decimals),
            userMintBalance: (0, helpers_1.convertAmountFromOnChainToHumanReadable)(user_address ? await (0, getUserMintBalance_1.getUserMintBalance)({ user_address, fa_address }) : 0, asset.decimals),
            yourBalance: (0, helpers_1.convertAmountFromOnChainToHumanReadable)(res.current_fungible_asset_balances[0]?.amount ?? 0, asset.decimals),
            isMintActive: isMintEnabled && asset.maximum_v2 > asset.supply_v2,
        };
    }
    catch (error) {
        throw new Error(`Failed to get asset data: ${error.message}`);
    }
}
