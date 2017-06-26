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
function recurExec(ctx, arr) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!arr || !arr.length) {
            return;
        }
        let curr = arr[0];
        return yield curr(ctx, (...args) => __awaiter(this, void 0, void 0, function* () { return yield recurExec(ctx, arr.slice(1)); }));
    });
}
function compose(...middlewares) {
    if (!middlewares || !middlewares.length) {
        return;
    }
    return function (ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield recurExec(ctx, middlewares);
            next && (yield next(res));
        });
    };
}
exports.compose = compose;
//# sourceMappingURL=middleware.js.map