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
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../utils/config");
const txlist_1 = __importDefault(require("../models/txlist"));
const checkAuth_1 = __importDefault(require("./checkAuth"));
const saveOnChain = function (router) {
    router.post('/save-data', checkAuth_1.default, (ctx) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = ctx.request.body;
            // check if recieve address is dev's own
            console.log('==============data==============\n', data);
            const getHostedOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    appid: config_1.DOTWALLET_APP_ID,
                    appsecret: config_1.DOTWALLET_SECRET,
                },
                method: 'POST',
                data: {
                    coin_type: 'BSV',
                },
            };
            const getHostedAccount = yield axios_1.default('https://www.ddpurse.com/platform/openapi/v2/get_hosted_account', getHostedOptions);
            const getHostedData = getHostedAccount.data;
            console.log('==============getHostedData==============', getHostedData);
            if (!getHostedData.data.address) {
                throw getHostedData.msg;
            }
            const getBalanceOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    appid: config_1.DOTWALLET_APP_ID,
                    appsecret: config_1.DOTWALLET_SECRET,
                },
                method: 'POST',
                data: {
                    coin_type: 'BSV',
                },
            };
            const getBalance = yield axios_1.default('https://www.ddpurse.com/platform/openapi/v2/get_hosted_account_balance', getBalanceOptions);
            const getBalanceData = getBalance.data;
            console.log('==============getBalanceData==============', getBalanceData);
            if (!getBalanceData.data.confirm && getBalanceData.data.confirm !== 0) {
                console.log('getBalanceData.data.confirm;, getBalanceData.data.confirm;', getBalanceData.data.confirm);
                throw getBalanceData;
            }
            if (getBalanceData.data.confirm + getBalanceData.data.unconfirm < 700)
                throw 'developer wallet balance too low';
            const saveDataOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    appid: config_1.DOTWALLET_APP_ID,
                    appsecret: config_1.DOTWALLET_SECRET,
                },
                method: 'POST',
                data: {
                    coin_type: 'BSV',
                    data: JSON.stringify(data),
                    data_type: 0,
                },
            };
            const saveData = yield axios_1.default('https://www.ddpurse.com/platform/openapi/v2/push_chain_data', saveDataOptions);
            const saveDataData = saveData.data;
            console.log('==============saveDataData==============', saveDataData);
            const txlist = yield txlist_1.default.findOne({ title: 'main' });
            console.log('txlist', txlist);
            if (!txlist) {
                const newtxlist = new txlist_1.default();
                newtxlist.title = 'main';
                newtxlist.list = [];
                newtxlist.list.push(saveDataData.data.txid);
                newtxlist.save();
            }
            else {
                txlist.list.push(saveDataData.data.txid);
                txlist.save();
            }
            ctx.oK(txlist.list);
        }
        catch (err) {
            console.log('==============err==============\n', err);
            ctx.internalServerError(err);
        }
    }));
    router.get('/txlist', checkAuth_1.default, (ctx) => __awaiter(this, void 0, void 0, function* () {
        const txlist = yield txlist_1.default.findOne({ title: 'main' });
        if (!txlist) {
            ctx.noContent();
        }
        else
            ctx.oK(txlist.list);
    }));
    return router;
};
exports.default = saveOnChain;
//# sourceMappingURL=saveOnChain.js.map