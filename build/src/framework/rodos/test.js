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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var Decorators_1 = require('./Decorators');
let UserController = class {
    getUserById(req, test) {
        return __awaiter(this, void 0, Promise, function* () {
            return yield '11';
        });
    }
    test() {
    }
};
__decorate([
    Decorators_1.Get('/:id'),
    Middleware(this.test),
    Decorators_1.Render('xxx'),
    __param(0, Decorators_1.Req()),
    __param(1, Decorators_1.Body()), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Object]), 
    __metadata('design:returntype', void 0)
], UserController.prototype, "getUserById", null);
UserController = __decorate([
    Decorators_1.Controller('/api/user'), 
    __metadata('design:paramtypes', [])
], UserController);
var path = '/xxx';
function Middleware(fn) {
    return function (t, p, d) {
    };
}
