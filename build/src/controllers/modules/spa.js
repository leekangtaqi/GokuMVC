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
var express = require('express');
var context = require('../../context/context');
var userService = context.services.user;
var router = express.Router();
function index() {
    router.get('/', (req, res, next) => __awaiter(this, void 0, Promise, function* () {
        var user = yield userService.createAsync({ name: '11' });
        res.render('index', { username: 'zhangsan11' });
    }));
    return router;
}
exports.index = index;
