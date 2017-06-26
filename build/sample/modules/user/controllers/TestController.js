"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
class TestController {
    findTests() {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn('test => /');
            return '444';
        });
    }
    findTestById() {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn('33333');
            return '5555';
        });
    }
}
__decorate([
    src_1.UseBefore([function test1(ctx, next) {
            return __awaiter(this, void 0, void 0, function* () {
                console.warn('666');
                yield next();
            });
        }]),
    src_1.Get('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "findTests", null);
__decorate([
    src_1.Get('/:id'),
    src_1.UseAfter([function xxx(ctx, next) {
            return __awaiter(this, void 0, void 0, function* () {
                console.warn('....');
                yield next();
            });
        }, function (ctx, next) {
            return __awaiter(this, void 0, void 0, function* () {
                console.warn('....212121');
                yield next();
            });
        }
    ]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "findTestById", null);
exports.default = TestController;
//# sourceMappingURL=TestController.js.map