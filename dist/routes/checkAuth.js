"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = checkAuth;
//# sourceMappingURL=checkAuth.js.map