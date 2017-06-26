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
const src_1 = require("../../../../src");
let mw1 = function (ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.warn('mw1');
        yield next();
        console.warn('mw1 end');
    });
};
exports.mw1 = mw1;
let mw2 = function (ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.warn('mw2');
        yield next();
    });
};
exports.mw2 = mw2;
let composedByMw1AndMw2 = src_1.compose(mw1, mw2);
exports.composedByMw1AndMw2 = composedByMw1AndMw2;
let mw3 = function (ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.warn('mw3');
        yield next();
    });
};
exports.mw3 = mw3;
//# sourceMappingURL=UserMiddlewares.js.map