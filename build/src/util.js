"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    assert: (...args) => {
        let expectes = args.slice(0, args.length - 1);
        let message = args.slice(-1);
        for (let expect of expectes) {
            !expect && console.error(message);
        }
    }
};
//# sourceMappingURL=util.js.map