"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const mongoose_1 = require("mongoose");
const URL = "mongodb://127.0.0.1:27017/proDB";
const dbConfig = () => {
    (0, mongoose_1.connect)(URL)
        .then(() => {
        console.log();
        console.log("DB connected");
    })
        .catch((error) => {
        console.log("Error: ", error);
    });
};
exports.dbConfig = dbConfig;
