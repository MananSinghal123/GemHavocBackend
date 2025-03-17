"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenPrice = getTokenPrice;
/**
 * Fetches token price from the Pyth network
 * @param query Token query to search for
 * @returns Price feed data
 */
async function getTokenPrice(query) {
    try {
        const assetDataResponse = await fetch(`https://hermes.pyth.network/v2/price_feeds?query=${query}&asset_type=crypto`);
        const assetData = await assetDataResponse.json();
        const formattedData = assetData.map((data) => {
            return {
                id: data.id,
                displayName: data.attributes.display_symbol,
                symbol: data.attributes.symbol,
            };
        });
        const assetIdArray = formattedData.map((data) => data.id);
        if (assetIdArray.length === 0) {
            throw new Error("No assets found for the given query");
        }
        const assetPriceDataResponse = await fetch(`https://hermes.pyth.network/v2/updates/price/latest?ids[]=${assetIdArray.join("&ids[]=")}`);
        const assetPriceData = await assetPriceDataResponse.json();
        const priceFeed = formattedData.map((data) => {
            const priceData = assetPriceData.parsed.find((price) => price.id === data.id);
            return {
                ...data,
                price: (Number(priceData.price.price) / 10 ** Math.abs(priceData.price.expo)).toLocaleString() ||
                    Number(priceData.price.price).toLocaleString(),
            };
        });
        return priceFeed;
    }
    catch (error) {
        throw new Error(`Token transfer failed: ${error.message}`);
    }
}
