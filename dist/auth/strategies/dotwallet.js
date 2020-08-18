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
const passport_custom_1 = require("passport-custom");
const axios_1 = __importDefault(require("axios"));
const user_1 = __importDefault(require("../../models/user"));
const config_1 = require("../../utils/config");
const newSocialMedia_1 = require("../../utils/newSocialMedia");
const dotwalletStrat = new passport_custom_1.Strategy((ctx, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = ctx.query.code;
        console.log('==============got code==============\n', code);
        const data = {
            app_id: config_1.DOTWALLET_APP_ID,
            secret: config_1.DOTWALLET_SECRET,
            code: code,
        };
        console.log('==============data==============\n', data);
        const accessTokenRequest = yield axios_1.default.post('https://www.ddpurse.com/platform/openapi/access_token', data);
        console.log('==============access token result==============\n', accessTokenRequest);
        const accessData = accessTokenRequest.data.data;
        const accessToken = accessData.access_token;
        if (accessToken) {
            const userInfoRequest = yield axios_1.default.get('https://www.ddpurse.com/platform/openapi/get_user_info?access_token=' +
                accessToken);
            console.log('==============user info result==============\n', userInfoRequest.data);
            const profile = userInfoRequest.data.data;
            const id = profile.user_open_id;
            const user = yield user_1.default.findOne({ username: id });
            if (user && user.dotwallet)
                return done(null, user);
            else
                return newSocialMedia_1.createDotwalletAccount(user ? user : new user_1.default(), profile, accessToken, done);
        }
    }
    catch (err) {
        console.log('==============ERROR==============\n', err);
    }
    // ,,,
}));
exports.default = dotwalletStrat;
//# sourceMappingURL=dotwallet.js.map