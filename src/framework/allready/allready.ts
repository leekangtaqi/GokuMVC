"use strict";
import events = require('events');
const u = require('util');
var util: any = {};

class Ar extends events.EventEmitter{
    public s: any;
    public busy: boolean;
    public MAIN: any;
    constructor(){
        super();
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
    /**
     * Registry main method as application's entry point
     */
    ready(main){
        var me = this;
        if(me._allComplete()){
            main.apply(null);
        }else{
            me.MAIN.push(main);
        }
        return this;
    };
    /**
     * Register service
     * @param name  string
     * @param service Object<*>
     * @param opt_onMemberUp      function(ar, service)
     * @param opt_onMemberDown    function(ar, service)
     * @returns {ar}
     */
    add(name, service?, opt_onMemberUp?, opt_onMemberDown?){
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
    up(uid, service){
        var r = this;
        r.s.allReady[uid] = service;
        if(r._allComplete()){
            var fns = r.MAIN;
            fns.forEach(function(fn){
                fn.apply(null);
            });
            r.busy = false;
        }
    };

    /**
     * member down
     * @param id string
     */
    down(id){
        delete this.s.allReady[id];
        this.emit('disconnect', {id: id})
    };

    /**
     * @param fn function(*)
     * if all ready, execute the fn that provided directly
     */
    check(fn){
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
    disconnect(fn){
        var me = this;
        this.once('disconnect', function(data){
            fn.apply(null, [data.id]);
        });
        return this;
    };

    /**
     * Returns the ready instances's count
     * @return number
     */
    getReadyCount() {
        return Object.keys(this.s.allReady).length;
    };

    /**
     * Returns the ready instance for the nameId provided
     *
    * @param {string} nameId
    * @return {C}
    */
    getInstance(nameId) {
        if (this.s.allReady[nameId]) {
            return this.s.allReady[nameId];
        }
    };

    /**
     *
    * @param c C
    */
    _prepare(c){
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
    _allComplete(){
        return Object.keys(this.s.allPrepare).length === Object.keys(this.s.allReady).length
    };

    /**
     * Static method, use for specific client
     * @param client
     * @returns {C}
     */
    redis(client){
        var r = this;
        return new C(null, client, function(service, nameId){
            service.on('ready', readyHandler);
            function readyHandler(){
                r.up(nameId, service);
                service.removeListener('ready', readyHandler);
            }
        }, function(service, nameId){
            service.on('error', errorHandler);
            function errorHandler(){
                r.down(nameId);
                service.removeListener('error', errorHandler);
            }
        })
    };

    mongoose(client){
        var r = this;
        return new C(null, client, function(service, nameId){
            service.connection.on('open', openHandler);
            function openHandler(){
                r.up(nameId, service);
                service.connection.removeListener('open', openHandler);
            }
        }, function(service, nameId){
            service.connection.on('error', errorHandler);
            function errorHandler(){
                r.down(nameId);
                service.connection.removeListener('error', errorHandler);
            }
        })
    };

    amqp(client){
        var r = this;
        if(!util.isPromise(client)){
            throw new Error('ar.amqp invoke failed, input type illegal')
        }
        return new C(null, client, function(service, nameId){
            service.then(function(conn){
                r.up(nameId, service)
            })
        }, function noop(){})
    };
}




var C = function(nameId, service, onMemberUp, onMemberDown){
    this.id = nameId;
    this.service = service;
    this.onMemberUp = onMemberUp;
    this.onMemberDown = onMemberDown;
};

util.isObject = function(a){
    return util.typeof(a) === 'object'
};
util.typeof = function(a){
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
util.isPromise = function(v){
    return !!v && util.isObject(v) && (util.typeof(v['then']) === 'function' )
};

export = Ar;