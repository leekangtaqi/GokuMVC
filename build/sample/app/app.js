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
const config_1 = require("./config");
const src_1 = require("../../src");
const context_1 = require("./context");
const mongoose_1 = require("./mongoose");
const path = require("path");
let app = new src_1.Application();
app.addMember('mongoose', mongoose_1.default);
app.domainContext = context_1.default;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield app.readyAsync([path.join(__dirname, '../modules')]);
        app.listen(config_1.default.port, () => {
            console.warn(`application is startup, listening on port ${config_1.default.port}`);
        });
    });
}
main();
//# sourceMappingURL=app.js.map