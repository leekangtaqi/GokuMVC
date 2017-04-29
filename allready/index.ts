
var EventEmitter = require('events').EventEmitter;
var util:any = {};
var u = require('util');
var Ar:any = function(){
    EventEmitter.call(this);
    this.busy = false;
    this.s = {
        /**
         * Contains all components to prepare
         * @type {Object<*>}
         */
        allPrepare: {},
        /**
         * Contains all components to start
         * @type {Object<*>}
         */
        allReady: {},
        /**
         * user for gen unique ids for components
         */
        uid: 0
    };
    this.MAIN = []
};

u.inherits(Ar, EventEmitter);

/**
 * Registry main method as application's entry point
 */
Ar.prototype.ready = function(main:any){
    var me = this;
    if(me._allComplete()){
        main.apply(null);
    }else{
        me.MAIN.push(main);
    }
    return this;
};

var C:any = function(nameId:any, service:any, onMemberUp:any, onMemberDown:any){
    this.id = nameId;
    this.service = service;
    this.onMemberUp = onMemberUp;
    this.onMemberDown = onMemberDown;
};

/**
 * Register service
 * @param name  string
 * @param service Object<*>
 * @param opt_onMemberUp      function(ar, service)
 * @param opt_onMemberDown    function(ar, service)
 * @returns {ar}
 */
Ar.prototype.add = function(name:any, service:any, opt_onMemberUp:any, opt_onMemberDown:any){
    var argLen = [].slice.apply(arguments).length;
    var c = null;
    if(name && typeof name != 'string'){
        throw new Error('register service failed, when invoke ar.add');
    }
    if(argLen === 2){
        if(!(service instanceof C)){
            throw new Error('register service failed, when invoke ar.add');
        }
        c = arguments[1];
        c.id = name;
    }else{
        c = new C(name, service, opt_onMemberUp, opt_onMemberDown);
    }
    this._prepare(c);
    return this;
};

/**
 * member up
 * @param uid string
 * @param service Object<*>
 * @private
 */
Ar.prototype.up = function(uid:any, service:any){
    var r = this;
    r.s.allReady[uid] = service;
    if(r._allComplete()){
        var fns = r.MAIN;
        fns.forEach(function(fn:any){
            fn.apply(null);
        });
        r.busy = false;
    }
};

/**
 * member down
 * @param id string
 */
Ar.prototype.down = function(id:any){
    delete this.s.allReady[id];
    this.emit('disconnect', {id: id})
};

/**
 * @param fn function(*)
 * if all ready, execute the fn that provided directly
 */
Ar.prototype.check = function(fn:any){
    var me = this;
    if(me.busy){
        me.MAIN.push(fn);
    }else{
        me.ready(fn);
    }
    return this;
};

/**
 *
 * @param fn function(*)
 */
Ar.prototype.disconnect = function(fn:any){
    var me = this;
    this.once('disconnect', function(data:any){
        fn.apply(null, [data.id]);
    });
    return this;
};

/**
 * Returns the ready instances's count
 * @return number
 */
Ar.prototype.getReadyCount = function() {
    return Object.keys(this.s.allReady).length;
};

/**
 * Returns the ready instance for the nameId provided
 *
 * @param {string} nameId
 * @return {C}
 */
Ar.prototype.getInstance = function(nameId:any) {
    if (this.s.allReady[nameId]) {
        return this.s.allReady[nameId];
    }
};

/**
 *
 * @param c C
 */
Ar.prototype._prepare = function(c:any){
    var r = this;
    r.s.allPrepare[c.id] = c;
    if(util.typeof(c.onMemberUp) != 'function' && util.typeof(c.onMemberDown) != 'function'){
        throw new Error('component\'s up and down must be a function');
    }
    c.onMemberUp.apply(null, [c.service, c.id]);
    c.onMemberDown.apply(null, [c.service, c.id]);
};

/**
 * check for all services ready or not
 * @returns {boolean}
 * @private
 */
Ar.prototype._allComplete = function(){
    return Object.keys(this.s.allPrepare).length === Object.keys(this.s.allReady).length
};

/**
 * Static method, use for specific client
 * @param client
 * @returns {C}
 */
Ar.prototype.redis = function(client:any){
    var r = this;
    return new C(null, client, function(service:any, nameId:any){
        if(service.connected){
            return r.up(nameId, service);
        }
        service.on('ready', readyHandler);
        function readyHandler(){
            r.up(nameId, service);
            service.removeListener('ready', readyHandler);
        }
    }, function(service:any, nameId:any){
        service.on('error', errorHandler);
        function errorHandler(){
            r.down(nameId);
            service.removeListener('error', errorHandler);
        }
    })
};

Ar.prototype.mongoose = function(client:any){
    var r = this;
    return new C(null, client, function(service:any, nameId:any){
        if(service.connection.readyState === 1 ||
            service.connection.readyState === 2){
            return r.up(nameId, service);
        }
        service.connection.on('open', openHandler);
        function openHandler(){
            r.up(nameId, service);
            service.connection.removeListener('open', openHandler);
        }
    }, function(service:any, nameId:any){
        service.connection.on('error', errorHandler);
        function errorHandler(){
            r.down(nameId);
            service.connection.removeListener('error', errorHandler);
        }
    })
};

Ar.prototype.amqp = function(client:any){
    var r = this;
    if(!util.isPromise(client)){
        throw new Error('ar.amqp invoke failed, input type illegal')
    }
    return new C(null, client, function(service:any, nameId:any){
        service.then(function(conn:any){
            r.up(nameId, service)
        })
    }, function noop(){})
};
util.isObject = function(a:any){
    return util.typeof(a) === 'object'
};
util.typeof = function(a:any){
    var b = typeof a;
    if(typeof a === 'object'){
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
        } else {
            return "null";
        }
    } else {
        if ("function" == b && "undefined" == typeof a.call) {
            return "object";
        }
    }
    return b;
};
util.isPromise = function(v:any){
    return !!v && util.isObject(v) && (util.typeof(v['then']) === 'function' )
};

export default Ar;