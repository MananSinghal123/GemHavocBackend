"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAptosTools = void 0;
const account_1 = require("./account");
// import { AmnisStakeTool, AmnisWithdrawStakeTool } from "./amnis"
const aptos_1 = require("./aptos");
// import {
// 	EchelonBorrowTokenTool,
// 	EchelonLendTokenTool,
// 	EchelonRepayTokenTool,
// 	EchelonWithdrawTokenTool,
// } from "./echelon"
// import { EchoStakeTokenTool, EchoUnstakeTokenTool } from "./echo"
// import {
// 	MerkleTradeClosePositionTool,
// 	MerkleTradeGetPositionTool,
// 	MerkleTradePlaceLimitOrderTool,
// 	MerkleTradePlaceMarketOrderTool,
// } from "./merkletrade"
// import { OpenAICreateImageTool } from "./openai"
// import { PanoraSwapTool } from "./panora"
// import {
// 	ThalaAddLiquidityTool,
// 	ThalaMintMODTool,
// 	ThalaRedeemMODTool,
// 	ThalaRemoveLiquidityTool,
// 	ThalaStakeTokenTool,
// 	ThalaUnstakeTokenTool,
// } from "./thala"
const game_1 = require("./game");
const createAptosTools = (agent, config = {}) => {
    const tools = [
        //Game tools
        new game_1.GameGetWinCountTool(agent),
        new game_1.GameGetAssetDataTool(agent),
        new game_1.GamePlaceBetTool(agent),
        // Aptos tools
        new aptos_1.AptosBalanceTool(agent),
        new account_1.AptosAccountAddressTool(agent),
        //new AptosTransferTokenTool(agent),
        // // new AptosBurnNFTTool(agent),
        // new AptosBurnTokenTool(agent),
        // // new AptosTransferNFTTool(agent),
        // new AptosTransactionTool(agent),
        // new AptosGetTokenDetailTool(agent),
        // new AptosMintTokenTool(agent),
        // new AptosCreateTokenTool(agent),
        // new AptosGetTokenPriceTool(agent),
        // // Amnis tools
        // new AmnisStakeTool(agent),
        // new AmnisWithdrawStakeTool(agent),
        // // Joule tools
        // new JouleLendTokenTool(agent),
        // new JouleWithdrawTokenTool(agent),
        // new JouleBorrowTokenTool(agent),
        // new JouleRepayTokenTool(agent),
        // new JouleGetPoolDetails(agent),
        // new JouleGetUserPosition(agent),
        // new JouleGetUserAllPositions(agent),
        // // LiquidSwap tools
        // new LiquidSwapCreatePoolTool(agent),
        // new LiquidSwapAddLiquidityTool(agent),
        // new LiquidSwapRemoveLiquidityTool(agent),
        // new LiquidSwapSwapTool(agent),
        // // Aries tools
        // new AriesCreateProfileTool(agent),
        // new AriesWithdrawTool(agent),
        // new AriesBorrowTool(agent),
        // new AriesLendTool(agent),
        // new AriesRepayTool(agent),
        // // Thala tools
        // new ThalaAddLiquidityTool(agent),
        // new ThalaRemoveLiquidityTool(agent),
        // new ThalaMintMODTool(agent),
        // new ThalaRedeemMODTool(agent),
        // new ThalaUnstakeTokenTool(agent),
        // new ThalaStakeTokenTool(agent),
        // // Panora tools
        // new PanoraSwapTool(agent),
        // // OpenAI tools
        // new OpenAICreateImageTool(agent),
        // // Echo tools
        // new EchoStakeTokenTool(agent),
        // new EchoUnstakeTokenTool(agent),
        // // Echelon tools
        // new EchelonLendTokenTool(agent),
        // new EchelonWithdrawTokenTool(agent),
        // new EchelonRepayTokenTool(agent),
        // new EchelonBorrowTokenTool(agent),
        // // Merkletrade Tools
        // new MerkleTradeClosePositionTool(agent),
        // new MerkleTradeGetPositionTool(agent),
        // new MerkleTradePlaceLimitOrderTool(agent),
        // new MerkleTradePlaceMarketOrderTool(agent),
    ];
    return config.filter ? tools.filter((tool) => config?.filter?.includes(tool.name)) : tools;
};
exports.createAptosTools = createAptosTools;
__exportStar(require("./account"), exports);
// export * from "./amnis"
__exportStar(require("./aptos"), exports);
// export * from "./joule"
// export * from "./aries"
// export * from "./echelon"
// export * from "./echo"
// export * from "./liquidswap"
// export * from "./panora"
// export * from "./openai"
// export * from "./thala"
__exportStar(require("./game"), exports);
