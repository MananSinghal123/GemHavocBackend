"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserMintBalance = void 0;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const aptosClient_1 = require("./aptosClient");
const getUserMintBalance = async ({ fa_address, user_address }) => {
    const MODULE_ADDRESS_TOKEN = process.env.MODULE_ADDRESS_TOKEN || "0x1";
    const userMintedAmount = await (0, aptosClient_1.aptosClient)().view({
        payload: {
            function: `${ts_sdk_1.AccountAddress.from(MODULE_ADDRESS_TOKEN)}::launchpad::get_mint_balance`,
            functionArguments: [fa_address, user_address],
        },
    });
    return Number(userMintedAmount[0]);
};
exports.getUserMintBalance = getUserMintBalance;
