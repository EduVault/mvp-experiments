import Router from 'koa-router';
import * as KoaPassport from 'koa-passport';
import url from 'url';
import { DefaultState, Context } from 'koa';
import { ROUTES, CLIENT_CALLBACK } from '../utils/config';
import { IUser } from '../models/user';

const faecbook = function (router: Router<DefaultState, Context>, passport: typeof KoaPassport) {
    router.get(
        ROUTES.FACEBOOK_AUTH,
        passport.authenticate('facebook', { scope: ['public_profile', 'email'] }),
    );

    router.get(ROUTES.FACEBOOK_AUTH_CALLBACK, async (ctx, next) => {
        try {
            return passport.authenticate('facebook', async (err: string, user: IUser) => {
                if (err) {
                    console.log(err);
                    ctx.unauthorized(err, err);
                } else {
                    // console.log(user.facebook);
                    await ctx.login(user);
                    ctx.redirect(CLIENT_CALLBACK);
                }
            })(ctx, next);
        } catch (err) {
            console.log(err);
            ctx.unauthorized(err, err);
        }
    });
    return router;
};
export default faecbook;
