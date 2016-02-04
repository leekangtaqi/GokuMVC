"use strict";
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
var DispatcherRunner_1 = require('./DispatcherRunner');
var ExpressServer_1 = require('./server/ExpressServer');
function registerActionsInExpressApp(express, requireDirs) {
    var expressApp = new ExpressServer_1.ExpressServer(express);
    var dispatcherRunner = new DispatcherRunner_1.DispatcherRunner(expressApp);
    if (requireDirs && requireDirs.length) {
        requireDirs.map(dir => dispatcherRunner.loadFiles(dir, null, true));
    }
    dispatcherRunner.registerAllActions();
    return dispatcherRunner;
}
exports.registerActionsInExpressApp = registerActionsInExpressApp;
