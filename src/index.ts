/** Provides nodejs access to a global Websocket value, required by Hub API */
(global as any).WebSocket = require('isomorphic-ws');
import mongoose from 'mongoose';
import Koa from 'koa';
import cors from '@koa/cors';
import cookie from 'koa-cookie';
import sslify, { xForwardedProtoResolver } from 'koa-sslify';
import koaResponse from 'koa-response2';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import websockify from 'koa-websocket';

import connectDb from './mongo/mongoose';
import passportInit from './auth/passportInit';
import startRouter from './routes';
import userAuthRoute from './routes/wssUserAuthRoute';
import { PORT } from './utils/config';

const app = websockify(new Koa());
// const app = new koa();
/** Database */
const db = connectDb();
// mongoose.connection.collections['user'].drop(function (err) {
//     console.log('collection dropped');
// });

// db.dropDatabase();

/** Middlewares */
app.use(async function handleGeneralError(ctx, next) {
    try {
        await next();
    } catch (error) {
        ctx.internalServerError(error, error);
    }
});
app.use(cors({ credentials: true }));
if (process.env.NODE_ENV === 'production') app.use(sslify({ resolver: xForwardedProtoResolver }));
app.use(cookie());
app.use(logger());
app.use(bodyParser());
app.use(helmet());
app.use(
    koaResponse({
        format(status, payload, message = '') {
            return {
                code: status,
                data: payload,
                message,
            };
        },
    }),
);

/** Passport */
const passport = passportInit(app);

/** Routes */
const router = startRouter(app, passport);
/** Websockets */
userAuthRoute(app);
/** Start the server! */
app.listen(PORT, () => console.log(`Koa server listening on PORT ${PORT}`));
