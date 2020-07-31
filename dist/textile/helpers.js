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
exports.localUserAuth = exports.generateUserAuth = exports.localChallengHandler = exports.generateIdentity = exports.getAPISig = exports.newClientDB = void 0;
const threads_core_1 = require("@textile/threads-core");
const hub_1 = require("@textile/hub");
const config_1 = require("../utils/config");
const newClientDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const API = config_1.TEXTILE_API;
    const db = yield hub_1.Client.withKeyInfo({
        key: config_1.TEXTILE_USER_API_KEY,
        secret: config_1.TEXTILE_USER_API_SECRET,
    }, API);
    return db;
});
exports.newClientDB = newClientDB;
/** @param seconds (300) time until the sig expires */
const getAPISig = (seconds = 300) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield console.log('getting API sig');
        const expiration = yield new Date(Date.now() + 1000 * seconds);
        console.log('expiration', expiration);
        const signature = yield hub_1.createAPISig(config_1.TEXTILE_USER_API_KEY, expiration);
        return signature;
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
});
exports.getAPISig = getAPISig;
const localChallengHandler = (id) => {
    const challengeFunc = (challenge) => __awaiter(void 0, void 0, void 0, function* () {
        return yield id.sign(challenge);
    });
    return challengeFunc;
};
exports.localChallengHandler = localChallengHandler;
const generateIdentity = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield threads_core_1.Libp2pCryptoIdentity.fromRandom();
});
exports.generateIdentity = generateIdentity;
const generateUserAuth = (pubkey, challengeHandler) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield newClientDB();
    const token = yield db.getTokenChallenge(pubkey, challengeHandler);
    const signature = yield getAPISig();
    return Object.assign(Object.assign({}, signature), { token: token, key: config_1.TEXTILE_USER_API_KEY });
});
exports.generateUserAuth = generateUserAuth;
const localUserAuth = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield generateUserAuth(id.public.toString(), localChallengHandler(id));
});
exports.localUserAuth = localUserAuth;
//# sourceMappingURL=helpers.js.map