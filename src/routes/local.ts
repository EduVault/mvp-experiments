import Router from 'koa-router';
import * as KoaPassport from 'koa-passport';
import User, { IUser, hashPassword } from '../models/user';
import { DefaultState, Context } from 'koa';
import { PasswordRes } from '../types';
import { ROUTES, CLIENT_CALLBACK, APP_SECRET, JWT_EXPIRY } from '../utils/config';
import { createJwt, validateJwt } from '../utils/jwt';
const local = function (router: Router<DefaultState, Context>, passport: typeof KoaPassport) {
    router.post(ROUTES.LOCAL_SIGNUP, async (ctx) => {
        const username = ctx.request.body.username;
        const previousUser = await User.findOne({ username: username });
        if (previousUser) {
            ctx.unauthorized({ error: 'user already exists' }, 'user already exists');
            return;
        }
        const newUser = new User();
        newUser.username = username;
        newUser.password = hashPassword(ctx.request.body.password);
        newUser.encryptedKeyPair = ctx.request.body.encryptedKeyPair;
        newUser.pubKey = ctx.request.body.pubKey;
        newUser.threadIDStr = ctx.request.body.threadIDStr;
        console.log('ctx.request.body', ctx.request.body);
        newUser.save();
        await ctx.login(newUser);
        ctx.session.jwt = createJwt(newUser.username);
        await ctx.session.save();
        ctx.oK(
            {
                encryptedKeyPair: newUser.encryptedKeyPair,
                jwt: ctx.session.jwt,
                pubKey: newUser.pubKey,
                threadIDStr: newUser.threadIDStr,
            },
            null,
        );
    });
    router.post(ROUTES.LOCAL_LOGIN, async (ctx, next) => {
        return passport.authenticate('local', async (err: string, user: IUser) => {
            if (err) {
                ctx.unauthorized(err, err);
            } else {
                await ctx.login(user);
                ctx.session.jwt = createJwt(user.username);
                await ctx.session.save();
                const returnData = {
                    encryptedKeyPair: user.encryptedKeyPair,
                    jwt: ctx.session.jwt,
                    pubKey: user.pubKey,
                    threadIDStr: user.threadIDStr,
                };
                console.log('login authorized. returnData', returnData);
                ctx.oK(returnData, null);
            }
        })(ctx, next);
    });
    return router;
};
export default local;
