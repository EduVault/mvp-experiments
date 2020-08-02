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
    function signup(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = ctx.request.body;
            const previousUser = yield user_1.default.findOne({
                username: data.username,
            });
            if (previousUser) {
                ctx.unauthorized({ error: 'user already exists' }, 'user already exists');
                return;
            }
            if (!data.password ||
                !data.username ||
                !data.encryptedKeyPair ||
                !data.pubKey ||
                !data.threadIDStr) {
                ctx.unauthorized({ error: 'invalid signup' }, 'invalid signup');
                return;
            }
            const newUser = new user_1.default();
            newUser.username = data.username;
            newUser.password = user_1.hashPassword(data.password);
            newUser.encryptedKeyPair = data.encryptedKeyPair;
            newUser.pubKey = data.pubKey;
            newUser.threadIDStr = data.threadIDStr;
            // console.log('data', data);
            console.log('new user', newUser.toJSON());
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
        });
    }
    router.post(config_1.ROUTES.LOCAL, (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findOne({ username: ctx.request.body.username });
        if (!user)
            return signup(ctx);
        else
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
                    // console.log('login authorized. returnData', returnData);
                    ctx.oK(returnData, null);
                }
            }))(ctx, next);
    }));
    return router;
};
exports.default = local;
//# sourceMappingURL=local.js.map