import type { AccountAuthenticator } from "@aptos-labs/ts-sdk"

export type ToolsNameList =
	| "aptos_balance"
	| "aptos_get_wallet_address"
	| "aptos_asset_data"
	| "aptos_win_count"
	| "aptos_place_bet"
	

export type SignedTransactionResponse = {
	senderAuthenticator?: AccountAuthenticator
	signature?: Uint8Array<ArrayBufferLike>
}
