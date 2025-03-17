//import { AccountAddress, aptosClient } from "aptos"
import { AccountAddress } from "@aptos-labs/ts-sdk";
import { AgentRuntime } from "../../agent"
import { aptosClient } from "../../utils/aptosClient";

/**
 * Fetches the number of times a player has won the game
 * @param player_addr The address of the player to check
 * @returns The number of wins for the player
 * @example
 * ```ts
 * const winCount = await getWinCount({ player_addr: "0x123abc..." })
 * ```
 */
export async function getWinCount(player_addr :string): Promise<number> {
  try {
    const MODULE_ADDRESS_TOKEN = process.env.MODULE_ADDRESS_TOKEN || "0x1"
    
    const winCount = await aptosClient().view({
      payload: {
        function: `${AccountAddress.from(MODULE_ADDRESS_TOKEN)}::launchpad::get_win_count`,
        functionArguments: [MODULE_ADDRESS_TOKEN, player_addr],
      },
    });

    console.log(winCount)

    const winCountValue = winCount[0] as number | undefined;
    if (winCountValue === undefined) {
      throw new Error("Win count is undefined");
    }
    return winCountValue;
  } catch (error: any) {
    throw new Error(`Failed to get win count: ${error.message}`);
  }
}