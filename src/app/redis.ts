import fullSettings = require('../settings');
import redis = require('redis');
import loggerModule = require('./logging');
var settings = fullSettings.redis;
var logger = loggerModule.logger;
var DEFAULT_NAME = 'default';
var clients = {};

var infolog = function (msg) {
    return function() {
        logger.info(msg, arguments);
    }
};
var warnlog = function (msg) {
    return function() {
        logger.warn(msg, arguments);
    }
};
var errorlog = function (msg) {
    return function() {
        logger.error(msg, arguments);
    }
};
 
const createRedisClient = function(name){
    var redisClient: redis.RedisClient;
    if (settings.mode == 'single') {
        redisClient = redis.createClient(settings.port, settings.host, {} ); //TODO: need options
    } else { 
        redisClient = null; //TODO: sentinel
    }
  
    if (settings.auth != '') {redisClient.auth(settings.auth);}

    var url = 'redis://' + redisClient['address'];
    redisClient.on('connect'     , infolog('Redis client ' + name + ' is connecting to ' + url));
    redisClient.on('ready'       , infolog('Redis client ' + name + ' is ready'));
    redisClient.on('reconnecting', warnlog('Redis client ' + name + ' is reconnecting to ' + url));
    redisClient.on('error'       , errorlog('Redis client ' + name + ' error happens'));
    redisClient.on('end'         , infolog('Redis client ' + name + ' is ended'));
    return redisClient;
};

export = function redisClient(name?){
    name = name || DEFAULT_NAME;
    if(clients[name]) return clients[name];
    return clients[name] = createRedisClient(name);
};
