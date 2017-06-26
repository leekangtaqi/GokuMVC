"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = require('events').EventEmitter;
var util = {};
var u = require('util');
var Ar = function () {
    EventEmitter.call(this);
    this.busy = false;
    this.s = {
        allPrepare: {},
        allReady: {},
        uid: 0
    };
    this.MAIN = [];
};
u.inherits(Ar, EventEmitter);
Ar.prototype.ready = function (main) {
    var me = this;
    if (me._allComplete()) {
        main.apply(null);
    }
    else {
        me.MAIN.push(main);
    }
    return this;
};
var C = function (nameId, service, onMemberUp, onMemberDown) {
    this.id = nameId;
    this.service = service;
    this.onMemberUp = onMemberUp;
    this.onMemberDown = onMemberDown;
};
Ar.prototype.add = function (name, service, opt_onMemberUp, opt_onMemberDown) {
    var argLen = [].slice.apply(arguments).length;
    var c = null;
    if (name && typeof name != 'string') {
        throw new Error('register service failed, when invoke ar.add');
    }
    if (argLen === 2) {
        if (!(service instanceof C)) {
            throw new Error('register service failed, when invoke ar.add');
        }
        c = arguments[1];
        c.id = name;
    }
    else {
        c = new C(name, service, opt_onMemberUp, opt_onMemberDown);
    }
    this._prepare(c);
    return this;
};
Ar.prototype.up = function (uid, service) {
    var r = this;
    r.s.allReady[uid] = service;
    if (r._allComplete()) {
        var fns = r.MAIN;
        fns.forEach(function (fn) {
            fn.apply(null);
        });
        r.busy = false;
    }
};
Ar.prototype.down = function (id) {
    delete this.s.allReady[id];
    this.emit('disconnect', { id: id });
};
Ar.prototype.check = function (fn) {
    var me = this;
    if (me.busy) {
        me.MAIN.push(fn);
    }
    else {
        me.ready(fn);
    }
    return this;
};
Ar.prototype.disconnect = function (fn) {
    var me = this;
    this.once('disconnect', function (data) {
        fn.apply(null, [data.id]);
    });
    return this;
};
Ar.prototype.getReadyCount = function () {
    return Object.keys(this.s.allReady).length;
};
Ar.prototype.getInstance = function (nameId) {
    if (this.s.allReady[nameId]) {
        return this.s.allReady[nameId];
    }
};
Ar.prototype._prepare = function (c) {
    var r = this;
    r.s.allPrepare[c.id] = c;
    if (util.typeof(c.onMemberUp) != 'function' && util.typeof(c.onMemberDown) != 'function') {
        throw new Error('component\'s up and down must be a function');
    }
    c.onMemberUp.apply(null, [c.service, c.id]);
    c.onMemberDown.apply(null, [c.service, c.id]);
};
Ar.prototype._allComplete = function () {
    return Object.keys(this.s.allPrepare).length === Object.keys(this.s.allReady).length;
};
Ar.prototype.redis = function (client) {
    var r = this;
    return new C(null, client, function (service, nameId) {
        if (service.connected) {
            return r.up(nameId, service);
        }
        service.on('ready', readyHandler);
        function readyHandler() {
            r.up(nameId, service);
            service.removeListener('ready', readyHandler);
        }
    }, function (service, nameId) {
        service.on('error', errorHandler);
        function errorHandler() {
            r.down(nameId);
            service.removeListener('error', errorHandler);
        }
    });
};
Ar.prototype.mongoose = function (client) {
    var r = this;
    return new C(null, client, function (service, nameId) {
        service.connection.on('open', openHandler);
        function openHandler() {
            r.up(nameId, service);
            service.connection.removeListener('open', openHandler);
        }
    }, function (service, nameId) {
        service.connection.on('error', errorHandler);
        function errorHandler() {
            r.down(nameId);
            service.connection.removeListener('error', errorHandler);
        }
    });
};
Ar.prototype.amqp = function (client) {
    var r = this;
    if (!util.isPromise(client)) {
        throw new Error('ar.amqp invoke failed, input type illegal');
    }
    return new C(null, client, function (service, nameId) {
        service.then(function (conn) {
            r.up(nameId, service);
        });
    }, function noop() { });
};
util.isObject = function (a) {
    return util.typeof(a) === 'object';
};
util.typeof = function (a) {
    var b = typeof a;
    if (typeof a === 'object') {
        if (a) {
            if (a instanceof Array) {
                return "array";
            }
            if (a instanceof Object) {
                return b;
            }
            var c = Object.prototype.toString.call(a);
            if ("[object Window]" == c) {
                return "object";
            }
            if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
                return "array";
            }
            if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
                return "function";
            }
        }
        else {
            return "null";
        }
    }
    else {
        if ("function" == b && "undefined" == typeof a.call) {
            return "object";
        }
    }
    return b;
};
util.isPromise = function (v) {
    return !!v && util.isObject(v) && (util.typeof(v['then']) === 'function');
};
exports.default = Ar;
//# sourceMappingURL=index.js.map