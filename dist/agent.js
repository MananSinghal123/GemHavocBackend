"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRuntime = void 0;
const pyth_aptos_js_1 = require("@pythnetwork/pyth-aptos-js");
const price_feed_1 = require("./constants/price-feed");
const tools_1 = require("./tools");
const get_pool_address_by_token_name_1 = require("./utils/get-pool-address-by-token-name");
class AgentRuntime {
    constructor(account, aptos, config) {
        this.account = account;
        this.aptos = aptos;
        this.config = config ? config : {};
    }
    async getPythData() {
        const connection = new pyth_aptos_js_1.AptosPriceServiceConnection("https://hermes.pyth.network");
        return await connection.getPriceFeedsUpdateData(price_feed_1.priceFeed);
    }
    getBalance(mint) {
        return (0, tools_1.getBalance)(this, mint);
    }
    getWinCount(playerAddress) {
        return (0, tools_1.getWinCount)(playerAddress);
    }
    getAssetData(playerAddress) {
        return (0, tools_1.getAssetData)(playerAddress);
    }
    placeBet(amount) {
        return (0, tools_1.placeBet)(this, amount);
    }
    getTokenByTokenName(name) {
        return (0, get_pool_address_by_token_name_1.getTokenByTokenName)(name);
    }
}
exports.AgentRuntime = AgentRuntime;
