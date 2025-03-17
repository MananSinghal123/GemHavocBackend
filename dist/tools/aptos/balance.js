"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = getBalance;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
/**
 * Fetches balance of an aptos account
 * @param agent MoveAgentKit instance
 * @returns Transaction signature
 * @example
 * ```ts
 * const balance = await getBalance(agent)
 * ```
 */
async function getBalance(agent, mint) {
    try {
        if (mint) {
            let balance;
            if (mint.split("::").length !== 3) {
                const balances = await agent.aptos.getCurrentFungibleAssetBalances({
                    options: {
                        where: {
                            owner_address: {
                                _eq: agent.account.getAddress().toStringLong(),
                            },
                            asset_type: { _eq: mint },
                        },
                    },
                });
                balance = balances[0].amount ?? 0;
            }
            else {
                balance = await agent.aptos.getAccountCoinAmount({
                    accountAddress: agent.account.getAddress(),
                    coinType: mint,
                });
            }
            return balance;
        }
        const balance = await agent.aptos.getAccountAPTAmount({
            accountAddress: agent.account.getAddress(),
        });
        const convertedBalance = (0, ts_sdk_1.convertAmountFromOnChainToHumanReadable)(balance, 8);
        return convertedBalance;
    }
    catch (error) {
        throw new Error(`Token transfer failed: ${error.message}`);
    }
}
