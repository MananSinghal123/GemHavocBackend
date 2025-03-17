"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSigner = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const base_signer_1 = require("./base-signer");
class WalletSigner extends base_signer_1.BaseSigner {
    constructor(account, wallet, network = ts_sdk_1.Network.DEVNET) {
        const config = new ts_sdk_1.AptosConfig({ network });
        const aptos = new ts_sdk_1.Aptos(config);
        super(account, aptos);
        this.wallet = wallet;
    }
    getAddress() {
        const walletAddress = this.wallet?.account?.address;
        return walletAddress ? ts_sdk_1.AccountAddress.fromString(walletAddress.toString()) : this.account.accountAddress;
    }
    async signTransaction(transaction) {
        const senderAuthenticator = await this.wallet.signTransaction({
            transactionOrPayload: transaction,
        });
        return {
            senderAuthenticator: senderAuthenticator.authenticator,
        };
    }
    async sendTransaction(transaction) {
        const txHash = await this.wallet.signAndSubmitTransaction(transaction);
        return txHash.hash;
    }
    async signMessage(message) {
        return this.wallet.signMessage(message);
    }
}
exports.WalletSigner = WalletSigner;
