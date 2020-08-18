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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** Provides nodejs access to a global Websocket value, required by Hub API */
global.WebSocket = require('isomorphic-ws');
const koa_1 = __importDefault(require("koa"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_cookie_1 = __importDefault(require("koa-cookie"));
const koa_sslify_1 = __importStar(require("koa-sslify"));
const koa_response2_1 = __importDefault(require("koa-response2"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const koa_websocket_1 = __importDefault(require("koa-websocket"));
const ip_1 = __importDefault(require("ip"));
const mongoose_1 = __importDefault(require("./mongo/mongoose"));
const passportInit_1 = __importDefault(require("./auth/passportInit"));
const routes_1 = __importDefault(require("./routes"));
const wssUserAuthRoute_1 = __importDefault(require("./routes/wssUserAuthRoute"));
const config_1 = require("./utils/config");
const app = koa_websocket_1.default(new koa_1.default());
if (process.env.NODE_ENV === 'production')
    app.proxy = true;
/** Database */
const db = mongoose_1.default();
// mongoose.connection.collections['user'].drop(function (err) {
//     console.log('collection dropped');
// });
/** Middlewares */
app.use(function handleGeneralError(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield next();
        }
        catch (error) {
            console.log(error, error.message);
            ctx.internalServerError(error, error);
        }
    });
});
app.use(cors_1.default(config_1.CORS_CONFIG));
if (process.env.NODE_ENV === 'production')
    app.use(koa_sslify_1.default({ resolver: koa_sslify_1.xForwardedProtoResolver }));
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
app.listen(config_1.PORT, () => console.log(`Koa server listening at ${ip_1.default.address()}:${config_1.PORT}`));
//# sourceMappingURL=index.js.map