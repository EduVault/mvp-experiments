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
const googleStrat = new passport_google_oauth20_1.Strategy(config_1.GOOGLE_CONFIG, (ctx, token, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const email = profile.emails ? profile.emails[0].value.toLowerCase() || null : null;
    const user = yield user_1.default.findOne({
        username: email || profile.id,
    });
    // console.log('user', user);
    if (user) {
        if (!user.google) {
            user.google.id = profile.id;
            user.google.givenName = profile.name.givenName;
            user.google.familyName = profile.name.familyName;
            user.google.picture = profile.photos[0].value || null;
            user.google.token = token;
            user.save((err) => {
                if (err) {
                    console.log(err);
                    return done(err);
                }
                return done(null, user);
            });
        }
        return done(null, user);
    }
    else {
        const newUser = new user_1.default();
        newUser.username = email || profile.id;
        newUser.google.id = profile.id;
        newUser.google.givenName = profile.name.givenName;
        newUser.google.familyName = profile.name.familyName;
        newUser.google.picture = profile.photos[0].value || null;
        newUser.google.token = token;
        newUser.save((err) => {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    }
}));
exports.default = googleStrat;
//# sourceMappingURL=google.js.map