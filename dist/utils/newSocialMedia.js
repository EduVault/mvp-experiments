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
exports.createSocialMediaAccount = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const threads_core_1 = require("@textile/threads-core");
const hub_1 = require("@textile/hub");
function createSocialMediaAccount(user, type, profile, token, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = profile.emails ? profile.emails[0].value.toLowerCase() || null : null;
        if (!user.username)
            user.username = email || profile.id;
        const keyPair = yield threads_core_1.Libp2pCryptoIdentity.fromRandom();
        const encryptedKeyPair = crypto_js_1.default.AES.encrypt(keyPair.toString(), profile.id).toString();
        user.socialMediaKeyPair = encryptedKeyPair;
        user.pubKey = keyPair.public.toString();
        const newThreadID = hub_1.ThreadID.fromRandom();
        user.threadIDStr = newThreadID.toString();
        user[type].id = profile.id;
        user[type].givenName = profile.name.givenName;
        user[type].familyName = profile.name.familyName;
        user[type].picture = profile.photos[0].value || null;
        user[type].token = token;
        console.log('user', user);
        user.save((err) => {
            if (err) {
                console.log(err);
                return done(err);
            }
            return done(null, user);
        });
    });
}
exports.createSocialMediaAccount = createSocialMediaAccount;
//# sourceMappingURL=newSocialMedia.js.map