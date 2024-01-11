"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userModel = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    verifiedToken: {
        type: String,
    },
    verify: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("user", userModel);
