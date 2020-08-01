"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEXTILE_API = exports.TEXTILE_USER_API_SECRET = exports.TEXTILE_USER_API_KEY = exports.CLIENT_CALLBACK = exports.FACEBOOK_CONFIG = exports.GOOGLE_CONFIG = exports.ROUTES = exports.SESSION_OPTIONS = exports.JWT_EXPIRY = exports.APP_SECRET = exports.CORS_CONFIG = exports.ROOT_URL = exports.MONGO_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
dotenv_1.default.config({ path: './.env.local' }); // If the .env file is not just .env, you need this config
/** needs to match ports in docker-compose file */
const PORT = parseInt(process.env.PORT, 10) || 3000;
exports.PORT = PORT;
/** for dev, needs to match service name from docker-compose file. if hosting on heroku MONGO_URI will be an env, if not you need to manually create one*/
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017';
exports.MONGO_URI = MONGO_URI;
const ROOT_URL = process.env.NODE_ENV === 'production' ? 'https://eduvault.herokuapp.com' : 'localhost:' + PORT;
exports.ROOT_URL = ROOT_URL;
const CORS_CONFIG = {
    credentials: true,
    origin: (ctx) => {
        console.log('===================================ctx.request.header.origin===================================\n', ctx.request.header.origin);
        const validDomains = [
            process.env.NODE_ENV !== 'production' ? 'http://localhost:8080' : '',
            'https://master--thirsty-ardinghelli-577c63.netlify.app',
            'https://thirsty-ardinghelli-577c63.netlify.app',
        ];
        if (validDomains.indexOf(ctx.request.header.origin) !== -1) {
            console.log('\n is valid');
            return ctx.request.header.origin;
        }
        return validDomains[0]; // we can't return void, so let's return one of the valid domains
    },
};
exports.CORS_CONFIG = CORS_CONFIG;
const APP_SECRET = process.env.APP_SECRET || 'secretString!%@#$@%';
exports.APP_SECRET = APP_SECRET;
/** expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d" */
const JWT_EXPIRY = '30d';
exports.JWT_EXPIRY = JWT_EXPIRY;
const SESSION_OPTIONS = {
    key: 'koa.sess' /** (string) cookie key (default is koa.sess) */,
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 1000 * 60 * 60 * 48 /** 48 hours*/,
    autoCommit: true /** (boolean) automatically commit headers (default true) */,
    overwrite: true /** (boolean) can overwrite or not (default true) */,
    httpOnly: process.env.NODE_ENV === 'production'
        ? true
        : false /** (boolean) httpOnly or not (default true) */,
    signed: true /** (boolean) signed or not (default true) */,
    rolling: true /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
    renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
    secure: process.env.NODE_ENV === 'production' ? true : false /** (boolean) secure cookie*/,
    sameSite: null /** (string) session cookie sameSite options (default null, don't set it) */,
};
exports.SESSION_OPTIONS = SESSION_OPTIONS;
/** Sometimes the callback cannot find the referer, In a real setup, we might need apps that use this backend to register a callback */
const CLIENT_CALLBACK = process.env.NODE_ENV === 'production'
    ? 'https://thirsty-ardinghelli-577c63.netlify.app/'
    : 'http://localhost:8080/home/';
exports.CLIENT_CALLBACK = CLIENT_CALLBACK;
const ROUTES = {
    FACEBOOK_AUTH: '/auth/facebook',
    FACEBOOK_AUTH_CALLBACK: '/auth/facebook/callback',
    GOOGLE_AUTH: '/auth/google',
    GOOGLE_AUTH_CALLBACK: '/auth/google/callback',
    LOCAL_SIGNUP: '/auth/local-signup',
    LOCAL_LOGIN: '/auth/local-login',
    VERIFY_JWT: '/verify-jwt',
    TEXTILE_RENEW: '/renew-textile',
};
exports.ROUTES = ROUTES;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CONFIG = {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: ROUTES.GOOGLE_AUTH_CALLBACK,
    passReqToCallback: true,
};
exports.GOOGLE_CONFIG = GOOGLE_CONFIG;
const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const FACEBOOK_CONFIG = {
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: ROUTES.FACEBOOK_AUTH_CALLBACK,
    profileFields: ['id', 'email', 'name', 'photos'],
    display: 'popup',
    passReqToCallback: true,
};
exports.FACEBOOK_CONFIG = FACEBOOK_CONFIG;
/** Textile */
const TEXTILE_USER_API_KEY = process.env.TEXTILE_USER_API_KEY;
exports.TEXTILE_USER_API_KEY = TEXTILE_USER_API_KEY;
const TEXTILE_USER_API_SECRET = process.env.TEXTILE_USER_API_SECRET;
exports.TEXTILE_USER_API_SECRET = TEXTILE_USER_API_SECRET;
const TEXTILE_API = 'https://api.textile.io:3447';
exports.TEXTILE_API = TEXTILE_API;
//# sourceMappingURL=config.js.map