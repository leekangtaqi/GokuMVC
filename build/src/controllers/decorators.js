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
function route(config) {
    return function (t, p, d) {
        t.router[config.method](config.path, t[p]);
        t.handlers.push({
            handler: t[p],
            middlewares: []
        });
    };
}
exports.route = route;
function log(t, p, d) {
}
exports.log = log;
function Controller(o) {
    return function (o) {
    };
}
exports.Controller = Controller;
