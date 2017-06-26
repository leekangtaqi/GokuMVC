"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DispatcherRunner_1 = require("./DispatcherRunner");
const KoaServer_1 = require("./server/KoaServer");
function registerActionsInKoaApp(koa, context, requireDirs) {
    let koaApp = new KoaServer_1.KoaServer(koa);
    let dispatcherRunner = new DispatcherRunner_1.DispatcherRunner(koaApp, context);
    if (requireDirs && requireDirs.length) {
        requireDirs.map(dir => dispatcherRunner.loadFiles(dir, null, true));
    }
    dispatcherRunner.registerAllActions();
    dispatcherRunner.wireModules();
    return dispatcherRunner;
}
exports.registerActionsInKoaApp = registerActionsInKoaApp;
function registerActionsInExpressApp(express, context, requireDirs) {
}
exports.registerActionsInExpressApp = registerActionsInExpressApp;
//# sourceMappingURL=Factory.js.map