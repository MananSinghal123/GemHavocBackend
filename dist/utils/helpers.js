"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAmountFromOnChainToHumanReadable = exports.convertAmountFromHumanReadableToOnChain = exports.APT_DECIMALS = exports.dateToSeconds = void 0;
const dateToSeconds = (date) => {
    if (!date)
        return;
    const dateInSeconds = Math.floor(+date / 1000);
    return dateInSeconds;
};
exports.dateToSeconds = dateToSeconds;
exports.APT_DECIMALS = 8;
const convertAmountFromHumanReadableToOnChain = (value, decimal) => {
    return value * Math.pow(10, decimal);
};
exports.convertAmountFromHumanReadableToOnChain = convertAmountFromHumanReadableToOnChain;
const convertAmountFromOnChainToHumanReadable = (value, decimal) => {
    return value / Math.pow(10, decimal);
};
exports.convertAmountFromOnChainToHumanReadable = convertAmountFromOnChainToHumanReadable;
