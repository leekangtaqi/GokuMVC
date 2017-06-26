"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const util_1 = require("./util");
const context_1 = require("./context");
const allready_1 = require("./lib/allready");
const Factory_1 = require("./Factory");
let ar = new allready_1.default();
class Application extends Koa {
    constructor() {
        super(...arguments);
        this.sysMembers = [];
        this.domainContext = null;
        this.ctx = new context_1.default();
    }
    addMember(name, inst) {
        this.sysMembers.push({ name, inst });
    }
    ready(entries, callback) {
        util_1.default.assert(entries, `application expected several entries to wire modules.`);
        util_1.default.assert(this.domainContext, `application expected a applicationContext.`);
        if (this.sysMembers && this.sysMembers.length) {
            for (let { name, inst } of this.sysMembers) {
                if (name === 'redis' || name === 'mongoose') {
                    ar.add(name, ar[name](inst));
                }
                else {
                    ar.add(name, inst);
                }
            }
        }
        Factory_1.registerActionsInKoaApp(this, this.domainContext, entries);
        ar.ready(callback);
    }
    readyAsync(entries) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(r => {
                this.ready(entries, () => {
                    r();
                });
            });
        });
    }
}
exports.default = Application;
//# sourceMappingURL=app.js.map