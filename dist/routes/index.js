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
const koa_router_1 = __importDefault(require("koa-router"));
const local_1 = __importDefault(require("./local"));
const facebook_1 = __importDefault(require("./facebook"));
const google_1 = __importDefault(require("./google"));
const getUserFromSession_1 = __importDefault(require("../utils/getUserFromSession"));
const startRouter = (app, passport) => {
    const router = new koa_router_1.default();
    router.get('/ping', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        ctx.oK(null, 'pong!');
    }));
    const checkAuth = (ctx, next) => {
        console.log('cookie exists', !!ctx.cookie);
        // console.log('session', ctx.session.toJSON());
        if (!ctx.isAuthenticated()) {
            ctx.unauthorized(null, 'unautharized');
        }
        else {
            return next();
        }
    };
    router.get('/get-user', checkAuth, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('++++++++++++++++++get user+++++++++++++++++++');
        const user = yield (yield getUserFromSession_1.default(ctx.session.toJSON())).toObject();
        if (!user)
            ctx.internalServerError('user not found');
        // console.log(user);
        ctx.oK(Object.assign(Object.assign({}, user), { jwt: ctx.session.jwt }));
    }));
    router.get('/logout', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        ctx.session = null;
        ctx.logout();
        ctx.oK();
    }));
    router.get('/auth-check', checkAuth, (ctx) => {
        ctx.oK(null, 'ok');
    });
    router.post('/save-thread-id', checkAuth, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield getUserFromSession_1.default(ctx.session.toJSON());
        if (!user)
            ctx.internalServerError('user not found');
        // console.log(user);
        if (user.threadIDStr)
            ctx.oK({ threadIDStr: user.toObject().threadIDStr, exists: true });
        user.threadIDStr = ctx.request.body.threadIDStr;
        yield user.save();
        ctx.oK({ threadIDStr: user.threadIDStr });
    }));
    router.post('/upload-db-info', checkAuth, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield getUserFromSession_1.default(ctx.session.toJSON());
        if (!user)
            ctx.internalServerError('user not found');
        // console.log(user);
        if (user.DbInfo)
            ctx.oK({ DbInfo: user.toObject().DbInfo, exists: true });
        user.DbInfo = ctx.request.body.DbInfo;
        yield user.save();
        ctx.oK({ DbInfo: user.DbInfo });
    }));
    local_1.default(router, passport);
    facebook_1.default(router, passport);
    google_1.default(router, passport);
    app.use(router.routes()).use(router.allowedMethods());
    return router;
};
exports.default = startRouter;
//# sourceMappingURL=index.js.map