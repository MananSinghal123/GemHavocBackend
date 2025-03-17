"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetAssetData = useGetAssetData;
// Internal utils
const aptosClient_1 = require("./aptosClient");
/**
 * A react hook to get fungible asset data.
 */
async function useGetAssetData() {
    const fa_address = process.env.FA_ADDRESS || "0x1";
    const res = await (0, aptosClient_1.aptosClient)().queryIndexer({
        query: {
            variables: {
                fa_address,
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
         }`,
        },
    });
    const asset = res.fungible_asset_metadata[0];
    if (!asset)
        return null;
    return asset;
}
