"use strict";
var controllers = require('../controllers');
function dispatch(app) {
    controllers.index(app);
}
exports.dispatch = dispatch;
;
