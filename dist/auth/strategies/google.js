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
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_1 = __importDefault(require("../../models/user"));
const config_1 = require("../../utils/config");
const newSocialMedia_1 = require("../../utils/newSocialMedia");
const googleStrat = new passport_google_oauth20_1.Strategy(config_1.GOOGLE_CONFIG, (ctx, token, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const email = profile.emails ? profile.emails[0].value.toLowerCase() || null : null;
    const user = yield user_1.default.findOne({
        username: email || profile.id,
    });
    if (user && user.google)
        return done(null, user);
    else
        return newSocialMedia_1.createSocialMediaAccount(user ? user : new user_1.default(), 'google', profile, token, done);
}));
exports.default = googleStrat;
//# sourceMappingURL=google.js.map