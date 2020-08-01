"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importStar(require("../models/user"));
const config_1 = require("../utils/config");
const jwt_1 = require("../utils/jwt");
const local = function (router, passport) {
    router.post(config_1.ROUTES.LOCAL_SIGNUP, (ctx) => __awaiter(this, void 0, void 0, function* () {
        const username = ctx.request.body.username;
        const previousUser = yield user_1.default.findOne({ username: username });
        if (previousUser) {
            ctx.unauthorized({ error: 'user already exists' }, 'user already exists');
            return;
        }
        const newUser = new user_1.default();
        newUser.username = username;
        newUser.password = user_1.hashPassword(ctx.request.body.password);
        newUser.encryptedKeyPair = ctx.request.body.encryptedKeyPair;
        newUser.pubKey = ctx.request.body.pubKey;
        newUser.threadIDStr = ctx.request.body.threadIDStr;
        console.log('ctx.request.body', ctx.request.body);
        newUser.save();
        yield ctx.login(newUser);
        ctx.session.jwt = jwt_1.createJwt(newUser.username);
        yield ctx.session.save();
        ctx.oK({
            encryptedKeyPair: newUser.encryptedKeyPair,
            jwt: ctx.session.jwt,
            pubKey: newUser.pubKey,
            threadIDStr: newUser.threadIDStr,
        }, null);
    }));
    router.post(config_1.ROUTES.LOCAL_LOGIN, (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        return passport.authenticate('local', (err, user) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                ctx.unauthorized(err, err);
            }
            else {
                yield ctx.login(user);
                ctx.session.jwt = jwt_1.createJwt(user.username);
                yield ctx.session.save();
                const returnData = {
                    encryptedKeyPair: user.encryptedKeyPair,
                    jwt: ctx.session.jwt,
                    pubKey: user.pubKey,
                    threadIDStr: user.threadIDStr,
                };
                console.log('login authorized. returnData', returnData);
                ctx.oK(returnData, null);
            }
        }))(ctx, next);
    }));
    return router;
};
exports.default = local;
//# sourceMappingURL=local.js.map