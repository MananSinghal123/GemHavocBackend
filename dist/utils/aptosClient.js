"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aptosClient = aptosClient;
// import { APTOS_API_KEY, NETWORK } from "../constants";
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const aptos = new ts_sdk_1.Aptos(new ts_sdk_1.AptosConfig({
    network: ts_sdk_1.Network.TESTNET,
    clientConfig: { API_KEY: "aptoslabs_YHqHs1RkqEE_PJxfjAYDHRWLwhtvoA8FGpfz44aqQ3CPC" },
}));
// Reuse same Aptos instance to utilize cookie based sticky routing
function aptosClient() {
    return aptos;
}
