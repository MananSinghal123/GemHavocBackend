"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidSwapRemoveLiquidityTool = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const tools_1 = require("langchain/tools");
const __1 = require("../..");
const get_pool_address_by_token_name_1 = require("../../utils/get-pool-address-by-token-name");
const parse_fungible_asset_to_wrapped_asset_1 = require("../../utils/parse-fungible-asset-to-wrapped-asset");
class LiquidSwapRemoveLiquidityTool extends tools_1.Tool {
    constructor(agent) {
        super();
        this.agent = agent;
        this.name = "liquidswap_remove_liquidity";
        this.description = `this tool can be used to remove liquidity from liquidswap

if you want to remove APT and one of the token, mint will be "0x1::aptos_coin::AptosCoin"

if user added mintX or mintY as asset name, and you don't have the address of the asset, use these token names:
usdt,zusdt,zusdc,apt,sthapt,mod,thl,wusdc,zweth,wweth,cake,stapt,abtc,stone,truapt,sbtc
or whatever name the user has provided, you can use the token name to get the address of the token 

minMintX and minMintY are minimum amount of tokens to receive, default is 0

deposit liquidity in one of the pools to get LP tokens if you don't have LP tokens

Inputs (input is a JSON string):
mintX: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT" or "usdt (name of the token)" (required)
mintY: string, eg same as mintX (required)
lpAmount: number, eg 1 or 0.01 (required)
minMintX: number, eg 1 or 0.01 (optional)
minMintY: number, eg 1 or 0.01 (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = (0, __1.parseJson)(input);
            // Resolve token names to addresses
            let mintX = parsedInput.mintX;
            const tokenX = (0, get_pool_address_by_token_name_1.getTokenByTokenName)(mintX);
            if (tokenX) {
                mintX = tokenX.tokenAddress;
            }
            let mintY = parsedInput.mintY;
            const tokenY = (0, get_pool_address_by_token_name_1.getTokenByTokenName)(mintY);
            if (tokenY) {
                mintY = tokenY.tokenAddress;
            }
            const mintXDetail = await this.agent.getTokenDetails(mintX);
            const mintYDetail = await this.agent.getTokenDetails(mintY);
            const removeLiquidityTransactionHash = await this.agent.removeLiquidity((0, parse_fungible_asset_to_wrapped_asset_1.parseFungibleAssetAddressToWrappedAssetAddress)(mintX), (0, parse_fungible_asset_to_wrapped_asset_1.parseFungibleAssetAddressToWrappedAssetAddress)(mintY), (0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.lpAmount, 6), (0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.minMintX || 0, mintXDetail.decimals), (0, ts_sdk_1.convertAmountFromHumanReadableToOnChain)(parsedInput.minMintY || 0, mintYDetail.decimals));
            return JSON.stringify({
                status: "success",
                removeLiquidityTransactionHash,
                token: [
                    {
                        mintX: mintXDetail.name,
                        decimals: mintXDetail.decimals,
                    },
                    {
                        mintY: mintYDetail.name,
                        decimals: mintYDetail.decimals,
                    },
                ],
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.LiquidSwapRemoveLiquidityTool = LiquidSwapRemoveLiquidityTool;
