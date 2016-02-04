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
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var swig = require('swig');
var path = require('path');
var serverStatic = require('serve-static');
var Factory_1 = require('../framework/rodos/Factory');
exports.app = express();
require('../controllers/UserController');
require('../controllers/SpaController');
Factory_1.registerActionsInExpressApp(exports.app, [path.join(__dirname, '../controllers')]);
exports.app.set('views', path.join(__dirname, '../../../src/views'));
exports.app.set('view engine', 'html');
exports.app.set('view options', { layout: false });
exports.app.engine('html', swig.renderFile);
exports.app.use(bodyParser.urlencoded({ extended: true }));
exports.app.use(bodyParser.json());
exports.app.use(methodOverride());
exports.app.use('/public', serverStatic((path.join(__dirname + '../../../../public'))));
exports.app.use('/web', serverStatic((path.join(__dirname + '../../../../web'))));
var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    exports.app.use(errorHandler());
}
exports.app.listen(3000, function () {
    console.log("Express server listening on port %d in %s mode", 3000, exports.app.settings.env);
});
