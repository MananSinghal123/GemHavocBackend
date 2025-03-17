import { AgentRuntime } from "../../agent"
import { aptosClient } from "../../utils/aptosClient";
import { getMintEnabled } from "../../utils/getMintEnabled";
import { getUserMintBalance } from "../../utils/getUserMintBalance";
import { convertAmountFromOnChainToHumanReadable } from "../../utils/helpers";


export interface FungibleAsset {
    maximum_v2: number;
    supply_v2: number;
    name: string;
    symbol: string;
    decimals: number;
    asset_type: string;
    icon_uri: string;
  }
  
  interface MintQueryResult {
    fungible_asset_metadata: Array<FungibleAsset>;
    current_fungible_asset_balances: Array<{
      amount: number;
    }>;
  }
  
  interface MintData {
    maxSupply: number;
    currentSupply: number;
    yourBalance: number;
    userMintBalance: number;
    asset: FungibleAsset;
    isMintActive: boolean;
  }

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


export async function getAssetData( user_address: string ): Promise<any> {
  try {
    const fa_address = process.env.FA_ADDRESS || "0x1";
    if (!fa_address) return null;

    const res = await aptosClient().queryIndexer<MintQueryResult>({
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
    if (!asset) return null;

    const isMintEnabled = await getMintEnabled({ fa_address });

    return {
      asset,
      maxSupply: convertAmountFromOnChainToHumanReadable(asset.maximum_v2 ?? 0, asset.decimals),
      currentSupply: convertAmountFromOnChainToHumanReadable(asset.supply_v2 ?? 0, asset.decimals),
      userMintBalance: convertAmountFromOnChainToHumanReadable(
        user_address ? await getUserMintBalance({ user_address, fa_address }) : 0,
        asset.decimals,
      ),
      yourBalance: convertAmountFromOnChainToHumanReadable(
        res.current_fungible_asset_balances[0]?.amount ?? 0,
        asset.decimals,
      ),
      isMintActive: isMintEnabled && asset.maximum_v2 > asset.supply_v2,
    } satisfies MintData;
  } catch (error: any) {
    throw new Error(`Failed to get asset data: ${error.message}`);
  }
}