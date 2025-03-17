import type { AccountAddress, Aptos, MoveStructId } from "@aptos-labs/ts-sdk"
import { AptosPriceServiceConnection } from "@pythnetwork/pyth-aptos-js"
import { priceFeed } from "./constants/price-feed"
import type { BaseSigner } from "./signers"
import {getBalance,getWinCount,getAssetData,placeBet} from "./tools"
import { getTokenByTokenName } from "./utils/get-pool-address-by-token-name"

export class AgentRuntime {
	public account: BaseSigner
	public aptos: Aptos
	public config: any

	constructor(account: BaseSigner, aptos: Aptos, config?: any) {
		this.account = account
		this.aptos = aptos
		this.config = config ? config : {}
	}

	async getPythData() {
		const connection = new AptosPriceServiceConnection("https://hermes.pyth.network")

		return await connection.getPriceFeedsUpdateData(priceFeed)
	}

	getBalance(mint?: string | MoveStructId) {
		return getBalance(this, mint)
	}


	getWinCount(playerAddress: string) {
		return getWinCount(playerAddress)
	}

	getAssetData(playerAddress: string) {
		return getAssetData(playerAddress)
	}

    placeBet( amount: number) {
		return placeBet(this,amount)
	}

	getTokenByTokenName(name: string) {
		return getTokenByTokenName(name)
	}
}
