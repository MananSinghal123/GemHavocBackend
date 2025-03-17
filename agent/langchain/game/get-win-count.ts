import { Tool } from "langchain/tools"
import { type AgentRuntime, parseJson } from "../.."

export class GameGetWinCountTool extends Tool {
  name = "aptos_win_count"
  description = `Get the number of times a player has won the game on Aptos blockchain
  This tool returns the win count for a specific player address.
  Inputs (input is a JSON string):
  player_addr: string, eg "0x123abc..." (required) - The player's address on Aptos blockchain`

  constructor(private agent: AgentRuntime) {
    super()
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = parseJson(input)
      const player_addr = parsedInput.player_addr;

      if (!player_addr) {
        return JSON.stringify({
          status: "error",
          message: "player_addr is required",
          code: "MISSING_PLAYER_ADDRESS"
        })
      }

      const winCount = await this.agent.getWinCount(player_addr)

      return JSON.stringify({
        status: "success",
        winCount,
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