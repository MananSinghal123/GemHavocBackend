"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailedSendTransactionError = exports.PositionNotFoundError = exports.MerkleBaseError = void 0;
class MerkleBaseError extends Error {
    constructor(status, code, message) {
        super(message);
        this.code = code;
        this.status = status;
        Object.setPrototypeOf(this, MerkleBaseError.prototype);
    }
}
exports.MerkleBaseError = MerkleBaseError;
class PositionNotFoundError extends MerkleBaseError {
    constructor(pair, isLong, message) {
        super("error", "POSITION_NOT_FOUND", message);
        this.pair = pair;
        this.isLong = isLong;
    }
}
exports.PositionNotFoundError = PositionNotFoundError;
class FailedSendTransactionError extends MerkleBaseError {
    constructor(message, tx) {
        super("error", "FAILED_SEND_TRANSACTION", message);
        this.tx = tx;
    }
}
exports.FailedSendTransactionError = FailedSendTransactionError;
