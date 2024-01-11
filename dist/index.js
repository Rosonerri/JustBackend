"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = __importDefault(require("express"));
const dbConfig_1 = require("./utils/dbConfig");
const mainApp_1 = require("./mainApp");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const mongoSession = (0, connect_mongodb_session_1.default)(express_session_1.default);
const port = 2233;
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
var store = new mongoSession({
    uri: "mongodb://localhost:27017/proDB",
    collection: "session",
});
app.use((0, express_2.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "just-work",
    cookie: {
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 48,
        secure: false,
    },
    store: store,
}));
(0, mainApp_1.mainApp)(app);
const server = app.listen(port, () => {
    console.clear();
    (0, dbConfig_1.dbConfig)();
});
process.on("uncaughtException", (error) => {
    console.log("uncaughtException: ", error);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.log("ledRejection: ", reason);
    server.close(() => {
        process.exit(1);
    });
});
