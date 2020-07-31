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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../utils/config");
const google = function (router, passport) {
    router.get(config_1.ROUTES.GOOGLE_AUTH, passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get(config_1.ROUTES.GOOGLE_AUTH_CALLBACK, (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        return passport.authenticate('google', (err, user) => {
            if (err) {
                ctx.unauthorized(err, err);
            }
            else {
                ctx.login(user);
                ctx.redirect(config_1.CLIENT_CALLBACK);
            }
        })(ctx, next);
    }));
    return router;
};
exports.default = google;
//# sourceMappingURL=google.js.map