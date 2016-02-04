"use strict";
var requestMethod;
(function (requestMethod) {
    requestMethod[requestMethod["get"] = 0] = "get";
    requestMethod[requestMethod["post"] = 1] = "post";
    requestMethod[requestMethod["put"] = 2] = "put";
    requestMethod[requestMethod["delete"] = 3] = "delete";
})(requestMethod || (requestMethod = {}));
class ApplicationDecorator {
    constructor() {
    }
    ;
    decorate(app) {
        this.app = app;
        Object.assign(this.app, this);
        return app;
    }
    registerRouters() {
    }
    dispatch() {
    }
}
ApplicationDecorator.__decoratedRouters = new Map();
module.exports = ApplicationDecorator;
