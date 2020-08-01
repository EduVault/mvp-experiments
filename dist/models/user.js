"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validPassword = exports.hashPassword = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bCrypt = __importStar(require("bcrypt-nodejs"));
/* Mongoose will complain about duplicate keys if we set any of these as unique,
because we don't use them in all situations. So we should manually check if these are unique.
*/
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, required: false },
    password: { type: String, unique: false, required: false },
    encryptedKeyPair: { type: String, unique: false, required: false },
    socialMediaKeyPair: { type: String, unique: false, required: false },
    pubKey: { type: String, unique: false, required: false },
    threadIDStr: { type: String, unique: false, required: false },
    DbInfo: { type: String, unique: false, required: false },
    google: {
        id: { type: String, unique: false, required: false },
        token: { type: String, unique: false, required: false },
        email: { type: String, unique: false, required: false },
        givenName: { type: String, unique: false, required: false },
        familyName: { type: String, unique: false, required: false },
        picture: { type: String, unique: false, required: false },
    },
    facebook: {
        id: { type: String, unique: false, required: false },
        token: { type: String, unique: false, required: false },
        email: { type: String, unique: false, required: false },
        givenName: { type: String, unique: false, required: false },
        familyName: { type: String, unique: false, required: false },
        picture: { type: String, unique: false, required: false },
    },
}, {
    collection: 'user',
    timestamps: true,
});
exports.hashPassword = (password) => bCrypt.hashSync(password, bCrypt.genSaltSync(10));
exports.validPassword = function (providedPassword, storedPassword) {
    return bCrypt.compareSync(providedPassword, storedPassword);
};
exports.default = mongoose_1.default.model('user', UserSchema);
//# sourceMappingURL=user.js.map