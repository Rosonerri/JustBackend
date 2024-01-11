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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const googleapis_1 = require("googleapis");
// const GOOGLE_ID =
//   "672291155509-775tnltmjsmlr6atea4lib0rp9mdqecn.apps.googleusercontent.com";
// const GOOGLE_URL = "https://developers.google.com/oauthplayground/";
// const GOOGLE_SECRET = "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";
// const GOOGLE_REFRESH =
//   "1//04jkhus57V715CgYIARAAGAQSNwF-L9IrUL_e3AHiyB3TXrrpsXulGNuonvzWAMmtx7EbtUT45WuNLw5umrfZrU98EtzOqbeH2Yk";
const GOOGLE_ID = "848542784186-9os7noa7qvcg3nckfu38s3bhob8u6oga.apps.googleusercontent.com";
const GOOGLE_SECRET = "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";
const GOOGLE_URL = "https://developers.google.com/oauthplayground";
const GOOGLE_REFRESH = "1//04GgN8ydoI_ZdCgYIARAAGAQSNwF-L9IrKCOkFE95PncupZNTb3WCiygNcFb1vp20oW-1SMJTKzSWxnWw2B6nf4S85GXSTpgR44M";
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);
oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH });
const sendEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (yield oAuth.getAccessToken()).token;
    const transport = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "codelabbest@gmail.com",
            clientId: GOOGLE_ID,
            clientSecret: GOOGLE_SECRET,
            refreshToken: GOOGLE_REFRESH,
            accessToken: token,
        },
    });
    const tokenID = jsonwebtoken_1.default.sign({ id: user._id }, "simple");
    const readData = path_1.default.join(__dirname, "../views/index.ejs");
    const data = yield ejs_1.default.renderFile(readData, {
        userName: user.email.split("@")[0],
        link: `http://localhost:5173/${tokenID}`,
        url: `http://localhost:5173/${tokenID}`,
        token: user.verifiedToken,
    });
    const mailer = {
        from: "Just-Work💕👍 <codelabbest@gmail.com>",
        to: user.email,
        subject: "Account Registration",
        html: data,
    };
    transport.sendMail(mailer).then(() => {
        console.log("sent");
    });
    try {
    }
    catch (error) {
        return error;
    }
});
exports.sendEmail = sendEmail;
