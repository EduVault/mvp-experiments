"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_passport_1 = __importDefault(require("koa-passport"));
const koa_session_1 = __importDefault(require("koa-session"));
const user_1 = __importDefault(require("../models/user"));
const config_1 = require("../utils/config");
const local_1 = __importDefault(require("./strategies/local"));
const google_1 = __importDefault(require("./strategies/google"));
const facebook_1 = __importDefault(require("./strategies/facebook"));
exports.default = (app) => {
    /** If we aren't using sessions can comment out this
     * remember to also ad  { session: false } to each passport.authenticate call if you don't want session on that
     */
    app.keys = [config_1.APP_SECRET];
    app.use(koa_session_1.default(config_1.SESSION_OPTIONS, app));
    koa_passport_1.default.serializeUser(function (user, done) {
        done(null, user._id);
    });
    koa_passport_1.default.deserializeUser(function (id, done) {
        user_1.default.findById(id, function (err, user) {
            done(err, user);
        });
    });
    /** Our strategies here: */
    koa_passport_1.default.use(local_1.default);
    koa_passport_1.default.use(google_1.default);
    koa_passport_1.default.use(facebook_1.default);
    /** Boilerplate */
    app.use(koa_passport_1.default.initialize());
    app.use(koa_passport_1.default.session());
    return koa_passport_1.default;
};
//# sourceMappingURL=passportInit.js.map