"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
var settings = config_1.default.mongo;
var mongoose = require('mongoose');
var makeUrl = function (mongo) {
    var authPart = settings.username + ':' + settings.password + '@';
    var auth = settings.username ? authPart : '';
    var url = 'mongodb://' + auth + mongo.host + ':' + mongo.port + '/' + mongo.db;
    if (settings.slave) {
        url = url + ',' + mongo.slave_host + ':' + mongo.slave_port + '/' + mongo.db + '?replicaSet=mgset-682195';
    }
    return url;
};
var url = makeUrl(settings);
var options = {};
mongoose.connect(url, options);
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + url);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose error happens: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected to ' + url);
});
exports.default = mongoose;
//# sourceMappingURL=mongoose.js.map