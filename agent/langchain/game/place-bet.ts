import { Tool } from "langchain/tools"
import { type AgentRuntime, parseJson } from "../.."

export class GamePlaceBetTool extends Tool {
    name = "aptos_place_bet"
    description = `this tool can be used to place a bet with a specific asset type and amount

  Inputs ( input is a JSON string ):
  amount: string, the amount to bet (required)
  `

    constructor(private agent: AgentRuntime) {
        super()
    }

    protected async _call(input: string): Promise<string> {
        try {
            const parsedInput = parseJson(input)

            const placeBetResult = await this.agent.placeBet(
                parsedInput.amount,
            )

            return JSON.stringify({
                status: "success",
                transactionHash: placeBetResult.hash,
                betDetails: {
                    assetType: parsedInput.assetType,
                    amount: parsedInput.amount,
                }
            })
        } catch (error: any) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            })
        }
    }
}