"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMintEnabled = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const aptosClient_1 = require("./aptosClient");
const getMintEnabled = async ({ fa_address }) => {
    const MODULE_ADDRESS_TOKEN = process.env.MODULE_ADDRESS_TOKEN || "0x1";
    const mintEnabled = await (0, aptosClient_1.aptosClient)().view({
        payload: {
            function: `${ts_sdk_1.AccountAddress.from(MODULE_ADDRESS_TOKEN)}::launchpad::is_mint_enabled`,
            functionArguments: [fa_address],
        },
    });
    return mintEnabled[0];
};
exports.getMintEnabled = getMintEnabled;
