import type { AgentRuntime } from "../../agent"
import { useGetAssetData } from "../../utils/getAssetData";
import { convertAmountFromHumanReadableToOnChain } from "../../utils/helpers";

/**
 * Place a bet with a specific asset type and amount
 * @param agent MoveAgentKit instance
 * @param assetType Asset type to place a bet with
 * @param amount Amount to bet
 * @param decimals Number of decimals for the token
 * @returns Transaction hash and bet details
 */
export async function placeBet(
    agent: AgentRuntime,
    amount: number,
): Promise<{
    hash: string
    betDetails: any
}> {
    const MODULE_ADDRESS_TOKEN=process.env.MODULE_ADDRESS_TOKEN || "0x1";
    const asset= await useGetAssetData()
    try {
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: `${MODULE_ADDRESS_TOKEN}::launchpad::place_bet`,
                typeArguments: [],
                functionArguments: [
                    MODULE_ADDRESS_TOKEN,  // to_address
                    asset.asset_type,             // fa_obj (Object<Metadata>)
                    convertAmountFromHumanReadableToOnChain(amount, 10)  // amount (u64)
                ],
            },
        })

        const committedTransactionHash = await agent.account.sendTransaction(transaction)

        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        })

        if (!signedTransaction.success) {
            console.error(signedTransaction, "Place bet failed")
            throw new Error("Place bet failed")
        }

        return {
            hash: signedTransaction.hash,
            betDetails: {
                amount: amount,
                txDetails: signedTransaction.hash
            }
        }
    } catch (error: any) {
        throw new Error(`Place bet failed: ${error.message}`)
    }
}