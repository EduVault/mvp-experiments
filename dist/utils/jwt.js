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
exports.validateJwt = exports.createJwt = void 0;
const config_1 = require("./config");
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.createJwt = (username) => jsonwebtoken_1.default.sign({ data: { username: username } }, config_1.APP_SECRET, { expiresIn: config_1.JWT_EXPIRY });
exports.validateJwt = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.APP_SECRET);
        const exp = new Date(decoded.exp * 1000);
        const now = new Date();
        const valid = now < exp;
        const user = yield user_1.default.findOne({ username: decoded.data.username });
        if (user && valid) {
            return user;
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.log('err', err);
        return false;
    }
});
//# sourceMappingURL=jwt.js.map