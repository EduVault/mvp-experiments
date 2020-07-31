"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../utils/config");
const connectDb = () => {
    const db = mongoose_1.default.connection;
    mongoose_1.default.connect(config_1.MONGO_URI, { useNewUrlParser: true });
    db.on('error', console.error);
    db.on('connected', () => console.log('connected to mongo'));
    db.on('diconnected', () => console.log('Mongo is disconnected'));
    db.on('open', () => console.log('Connection Made!'));
    return db;
};
exports.default = connectDb;
//# sourceMappingURL=mongoose.js.map