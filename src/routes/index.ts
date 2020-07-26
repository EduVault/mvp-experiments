import Router from 'koa-router';
import websockify from 'koa-websocket';

import Koa from 'koa';
import * as KoaPassport from 'koa-passport';
import local from './local';
import facebook from './facebook';
import google from './google';
import { DefaultState, Context, Middleware } from 'koa';
import { CLIENT_CALLBACK } from '../utils/config';

const startRouter = (
    app: websockify.App<Koa.DefaultState, Koa.DefaultContext>,
    passport: typeof KoaPassport,
) => {
    const router = new Router<DefaultState, Context>();
    router.get('/ping', async (ctx) => {
        ctx.oK(null, 'pong!');
    });
    const checkAuth: Middleware = (ctx, next) => {
        if (!ctx.isAuthenticated()) {
            ctx.unauthorized(null, 'unautharized');
        } else {
            return next();
        }
    };
    router.get('/get-jwt', checkAuth, (ctx) => {
        console.log('session', ctx.session.toJSON());
        ctx.oK({ jwt: ctx.session.jwt }, 'ok');
    });
    router.get('/logout', async (ctx) => {
        ctx.session = null;
        ctx.logout();
        ctx.oK();
    });
    router.get('/auth-check', checkAuth, (ctx) => {
        ctx.oK(null, 'ok');
    });

    local(router, passport);
    facebook(router, passport);
    google(router, passport);

    app.use(router.routes()).use(router.allowedMethods());
    return router;
};

export default startRouter;
