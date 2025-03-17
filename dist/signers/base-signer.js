"use strict";
// src/signers/base-signer.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSigner = void 0;
class BaseSigner {
    constructor(account, aptos) {
        this.account = account;
        this.aptos = aptos;
    }
    getAddress() {
        return this.account.accountAddress;
    }
}
exports.BaseSigner = BaseSigner;
