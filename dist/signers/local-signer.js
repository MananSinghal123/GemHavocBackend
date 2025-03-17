"use strict";
// src/signers/local-signer.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalSigner = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const base_signer_1 = require("./base-signer");
class LocalSigner extends base_signer_1.BaseSigner {
    constructor(account, network = ts_sdk_1.Network.DEVNET) {
        const config = new ts_sdk_1.AptosConfig({ network });
        const aptos = new ts_sdk_1.Aptos(config);
        super(account, aptos);
    }
    getAddress() {
        return this.account.accountAddress;
    }
    async signTransaction(transaction) {
        const senderAuthenticator = this.aptos.transaction.sign({
            signer: this.account,
            transaction,
        });
        return {
            senderAuthenticator,
        };
    }
    async sendTransaction(transaction) {
        const signedTx = await this.signTransaction(transaction);
        const submittedTx = await this.aptos.transaction.submit.simple({
            transaction,
            senderAuthenticator: signedTx.senderAuthenticator,
        });
        const result = await this.aptos.waitForTransaction({
            transactionHash: submittedTx.hash,
        });
        return result.hash;
    }
    async signMessage(message) {
        const signedMessage = this.account.signWithAuthenticator(message);
        return signedMessage.toString();
    }
}
exports.LocalSigner = LocalSigner;
