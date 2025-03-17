"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapWithPanora = swapWithPanora;
const axios_1 = __importDefault(require("axios"));
/**
 * Swap tokens in panora
 * @param agent MoveAgentKit instance
 * @param fromToken Address of the token to swap from
 * @param toToken Address of the token to swap to
 * @param swapAmount Amount of tokens to swap
 * @param minCoinOut Minimum amount of tokens to receive (default 0)
 * @returns Transaction signature
 */
async function swapWithPanora(agent, fromToken, toToken, swapAmount, toWalletAddress) {
    try {
        const panoraParameters = {
            fromTokenAddress: fromToken,
            toTokenAddress: toToken,
            fromTokenAmount: swapAmount.toString(),
            toWalletAddress: toWalletAddress ? toWalletAddress : agent.account.getAddress().toString(),
        };
        const url = `https://api.panora.exchange/swap?${new URLSearchParams(panoraParameters).toString()}`;
        const panoraApiKey = agent.config.PANORA_API_KEY;
        if (!panoraApiKey) {
            throw new Error("No PANORA_API_KEY in config");
        }
        const res = await axios_1.default.post(url, {}, {
            headers: {
                "x-api-key": panoraApiKey,
            },
        });
        const response = await res.data;
        if (response.quotes.length <= 0) {
            throw new Error("no quotes available from panora");
        }
        const transactionData = response.quotes[0].txData;
        const transaction = await agent.aptos.transaction.build.simple({
            sender: agent.account.getAddress(),
            data: {
                function: transactionData.function,
                typeArguments: transactionData.type_arguments,
                functionArguments: transactionData.arguments,
            },
        });
        const committedTransactionHash = await agent.account.sendTransaction(transaction);
        const signedTransaction = await agent.aptos.waitForTransaction({
            transactionHash: committedTransactionHash,
        });
        if (!signedTransaction.success) {
            console.error(signedTransaction, "Swap failed");
            throw new Error("Swap tx failed");
        }
        return signedTransaction.hash;
    }
    catch (error) {
        throw new Error(`Swap failed: ${error.message}`);
    }
}
