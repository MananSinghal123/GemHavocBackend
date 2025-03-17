"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJson = void 0;
const parseJson = (input) => {
    try {
        const forbiddenWords = ["null", "undefined", "{}"];
        if (input in forbiddenWords)
            throw new Error();
        const parsedInput = JSON.parse(input);
        return parsedInput;
    }
    catch (e) {
        return {};
    }
};
exports.parseJson = parseJson;
