"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLastInterestRateIndex = void 0;
const removeLastInterestRateIndex = (obj) => {
    if (!obj || typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => (0, exports.removeLastInterestRateIndex)(item));
    }
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (key === "last_interest_rate_index") {
            return acc;
        }
        acc[key] = (0, exports.removeLastInterestRateIndex)(value);
        return acc;
    }, {});
};
exports.removeLastInterestRateIndex = removeLastInterestRateIndex;
