import Router from 'koa-router';
import * as KoaPassport from 'koa-passport';
import User, { IUser, hashPassword } from '../models/user';
import { DefaultState, Context } from 'koa';
import { PasswordRes } from '../types';
import { ROUTES, CLIENT_CALLBACK } from '../utils/config';

const local = function (router: Router<DefaultState, Context>, passport: typeof KoaPassport) {
    router.post(ROUTES.LOCAL_SIGNUP, async (ctx) => {
        try {
            const username = ctx.request.body.username;
            const previousUser = await User.findOne({ username: username });
            if (previousUser) {
                ctx.unauthorized({ error: 'user already exists' }, 'user already exists');
                return;
            }
            const newUser = new User();
            newUser.username = username;
            newUser.password = hashPassword(ctx.request.body.password);
            newUser.save();
            await ctx.login(newUser);
            await ctx.session.save();
            ctx.oK();
        } catch (err) {
            console.log(err);
            ctx.internalServerError(err, err.toString());
        }
    });
    router.post(ROUTES.LOCAL_LOGIN, async (ctx, next) => {
        return passport.authenticate('local', async (err: string, user: IUser) => {
            if (err) {
                ctx.unauthorized(err, err);
            } else {
                await ctx.login(user);
                await ctx.session.save();
                ctx.oK();
            }
        })(ctx, next);
    });
    return router;
};
export default local;
