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
/** Provides nodejs access to a global Websocket value, required by Hub API */
global.WebSocket = require('isomorphic-ws');
const koa_1 = __importDefault(require("koa"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_cookie_1 = __importDefault(require("koa-cookie"));
const koa_response2_1 = __importDefault(require("koa-response2"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const koa_websocket_1 = __importDefault(require("koa-websocket"));
const mongoose_1 = __importDefault(require("./mongo/mongoose"));
const passportInit_1 = __importDefault(require("./auth/passportInit"));
const routes_1 = __importDefault(require("./routes"));
const wssUserAuthRoute_1 = __importDefault(require("./routes/wssUserAuthRoute"));
const config_1 = require("./utils/config");
const app = koa_websocket_1.default(new koa_1.default());
// const app = new koa();
/** Database */
const db = mongoose_1.default();
// mongoose.connection.collections['user'].drop(function (err) {
//     console.log('collection dropped');
// });
// db.dropDatabase();
/** Middlewares */
app.use(function handleGeneralError(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield next();
        }
        catch (error) {
            ctx.internalServerError(error, error);
        }
    });
});
app.use(cors_1.default(config_1.CORS_CONFIG));
// if (process.env.NODE_ENV === 'production') app.use(sslify({ resolver: xForwardedProtoResolver }));
app.use(koa_cookie_1.default());
app.use(koa_logger_1.default());
app.use(koa_bodyparser_1.default());
app.use(koa_helmet_1.default());
app.use(koa_response2_1.default({
    format(status, payload, message = '') {
        return {
            code: status,
            data: payload,
            message,
        };
    },
}));
/** Passport */
const passport = passportInit_1.default(app);
/** Routes */
const router = routes_1.default(app, passport);
/** Websockets */
wssUserAuthRoute_1.default(app);
/** Start the server! */
app.listen(config_1.PORT, () => console.log(`Koa server listening on PORT ${config_1.PORT}`));
//# sourceMappingURL=index.js.map