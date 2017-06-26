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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const UserMiddlewares_1 = require("./UserMiddlewares");
const OrderController_1 = require("./OrderController");
let UserController = class UserController {
    constructor() {
        this.routes = null;
    }
    getUser({ ctx }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let UserService = ctx.app.ctx.services.UserService;
                return yield UserService.find();
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    getUserById(id, { ctx }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ctx.app.ctx.services.UserService.findById(id);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
};
__decorate([
    src_1.Get('/'),
    src_1.UseBefore([UserMiddlewares_1.mw3]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    src_1.Mount('/order', OrderController_1.default),
    __metadata("design:type", Object)
], UserController.prototype, "routes", void 0);
__decorate([
    src_1.Get('/:id'),
    __param(0, src_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
UserController = __decorate([
    src_1.Controller('/api/user'),
    src_1.UseBefore([
        UserMiddlewares_1.composedByMw1AndMw2
    ]),
    src_1.UseAfter([function useAfter(ctx, next) {
            return __awaiter(this, void 0, void 0, function* () {
                console.warn('use after **********');
                yield next();
            });
        }, function test() {
            return __awaiter(this, void 0, void 0, function* () {
                console.warn('end *************');
            });
        }])
], UserController);
exports.default = UserController;
//# sourceMappingURL=UserController.js.map