"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("./mongoose");
let context = {
    redis: null,
    mongoose: {
        main: null
    }
};
context.mongoose.main = mongoose_1.default;
exports.default = context;
//# sourceMappingURL=context.js.map