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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const emittery_1 = __importDefault(require("emittery")); // use the emitter to send events to ourself (the challenge)
const helpers_1 = require("../textile/helpers");
const jwt_1 = require("../utils/jwt");
const config_1 = require("../utils/config");
const router = new koa_router_1.default();
const userAuthRoute = (app) => {
    router.get('/ws/auth', (ctx) => {
        const emitter = new emittery_1.default();
        ctx.websocket.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('=================wss message===================', msg);
            try {
                const data = JSON.parse(msg.toString());
                if (!data.jwt) {
                    throw new Error('missing jwt');
                }
                const jwtCheck = yield jwt_1.validateJwt(data.jwt);
                console.log('jwtCheck', !!jwtCheck);
                if (!jwtCheck || !jwtCheck.pubKey || !jwtCheck.username) {
                    throw new Error('invalid jwt');
                }
                const user = jwtCheck;
                switch (data.type) {
                    case 'keys-request': {
                    }
                    case 'token-request': {
                        const pubKey = user.pubKey;
                        if (!pubKey) {
                            throw new Error('missing pubkey');
                        }
                        const db = yield helpers_1.newClientDB();
                        const token = yield db.getTokenChallenge(pubKey, (challenge) => {
                            return new Promise((resolve, reject) => {
                                let response = {};
                                response.type = 'challenge-request';
                                response.value = Buffer.from(challenge).toJSON();
                                ctx.websocket.send(JSON.stringify(response));
                                let recieved = false;
                                /** Wait for the challenge event from our event emitter */
                                emitter.on('challenge-response', (signature) => {
                                    recieved = true;
                                    // console.log('challenge-response signature', signature);
                                    resolve(Buffer.from(signature));
                                });
                                setTimeout(() => {
                                    reject();
                                    if (!recieved) {
                                        throw 'client took too long to respond';
                                    }
                                }, 10000);
                            });
                        });
                        /**
                         * The challenge was successfully completed by the client
                         */
                        console.log('challenge completed');
                        const apiSig = yield helpers_1.getAPISig();
                        const userAuth = Object.assign(Object.assign({}, apiSig), { token: token, key: config_1.TEXTILE_USER_API_KEY });
                        ctx.websocket.send(JSON.stringify({
                            type: 'token-response',
                            value: userAuth,
                        }));
                        break;
                    }
                    /** Waiting for a response from the client to the challenge above.
                     * result will get sent back to resolve on the line: emitter.on('challenge', (signature) => {
                     */
                    case 'challenge-response': {
                        if (!data.signature) {
                            throw new Error('missing signature');
                        }
                        console.log('got signature response');
                        yield emitter.emit('challenge-response', data.signature);
                        break;
                    }
                }
            }
            catch (error) {
                console.log(error);
                /** Notify our client of any errors */
                ctx.websocket.send(JSON.stringify({
                    type: 'error',
                    value: error.message,
                }));
            }
        }));
    });
    //@ts-ignore
    app.ws.use(router.routes()).use(router.allowedMethods());
};
exports.default = userAuthRoute;
//# sourceMappingURL=wssUserAuthRoute.js.map