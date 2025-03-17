import { useQuery } from "@tanstack/react-query";
// Internal utils
import { aptosClient } from "./aptosClient";

/**
 * A react hook to get fungible asset data.
 */
export async function useGetAssetData() {
  const fa_address = process.env.FA_ADDRESS || "0x1";
      const res:any = await aptosClient().queryIndexer({
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
      if (!asset) return null;

      return asset;

}