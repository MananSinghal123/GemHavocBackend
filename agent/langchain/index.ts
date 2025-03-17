import type { AgentRuntime } from "../agent"
import { AptosAccountAddressTool } from "./account"
import {AptosBalanceTool} from "./aptos"
import type { ToolsNameList } from "../types"
import { GamePlaceBetTool, GameGetAssetDataTool, GameGetWinCountTool } from "./game"

export const createAptosTools = (agent: AgentRuntime, config: { filter?: ToolsNameList[] } = {}) => {
	const tools = [
		//Game tools
		new GameGetWinCountTool(agent),
		new GameGetAssetDataTool(agent),
		// new GamePlaceBetTool(agent),

		// Aptos tools
		// new AptosBalanceTool(agent),
		// new AptosAccountAddressTool(agent),
		
	]

	return config.filter ? tools.filter((tool) => config?.filter?.includes(tool.name as ToolsNameList)) : tools
}

export * from "./account"
export * from "./aptos"
export * from "./game"