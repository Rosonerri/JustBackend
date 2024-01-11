"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOutUser = exports.readUserCookie = exports.verifyUser = exports.signinUser = exports.readOneUser = exports.readUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const email_1 = require("../utils/email");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const token = crypto_1.default.randomBytes(3).toString("hex");
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const user = yield userModel_1.default.create({
            email,
            password: hash,
            verifiedToken: token,
        });
        (0, email_1.sendEmail)(user);
        return res.status(201).json({
            message: "user created",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating user",
        });
    }
});
exports.registerUser = registerUser;
const readUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.find();
        return res.status(200).json({
            message: "user read",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error reading user",
        });
    }
});
exports.readUser = readUser;
const readOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        return res.status(200).json({
            message: "user read",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error reading user",
        });
    }
});
exports.readOneUser = readOneUser;
const signinUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            const readPassword = yield bcrypt_1.default.compare(password, user.password);
            if (readPassword) {
                if (user.verifiedToken === "" && user.verify) {
                    const token = jsonwebtoken_1.default.sign({ id: user._id }, "thh", { expiresIn: "2d" });
                    req.session.isAuth = true;
                    req.session.data = user._id;
                    return res.status(201).json({
                        message: "Welcome back",
                        data: token,
                    });
                }
                else {
                    return res.status(404).json({
                        message: "Your account hasn't been verified",
                    });
                }
            }
            else {
                return res.status(404).json({
                    message: "password is incorrect",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "no user found",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error reading user",
        });
    }
});
exports.signinUser = signinUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { verifiedToken } = req.body;
        const user = yield userModel_1.default.findById(userID);
        if (user.verifiedToken === verifiedToken) {
            yield userModel_1.default.findByIdAndUpdate(userID, {
                verifiedToken: "",
                verify: true,
            }, { new: true });
            return res.status(200).json({
                message: "user verify",
            });
        }
        else {
            return res.status(404).json({
                message: "user not found",
                data: user,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error reading user",
        });
    }
});
exports.verifyUser = verifyUser;
const readUserCookie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.session;
        return res.status(200).json({
            message: "user read",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error reading user",
        });
    }
});
exports.readUserCookie = readUserCookie;
const logOutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.session.destroy();
        return res.status(200).json({
            message: "user has logged out",
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error reading user",
        });
    }
});
exports.logOutUser = logOutUser;
