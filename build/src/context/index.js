var AllReady = require('../framework/allready/allready');
var DomainBuilder = require('../framework/mongoose/DomainBuilder');
var context = require('./context');
var redisMain = require('../app/redis');
var mongooseMain = require('../app/mongoose');
var ar = new AllReady();
ar.add('redis', ar.redis(redisMain()));
ar.add('mongoose', ar.mongoose(mongooseMain));
context.redis.main = redisMain();
context.mongoose.main = mongooseMain;
context.domainBuilder.main = DomainBuilder;
ar.ready(() => {
    var modules = require('../modules');
    _.values(modules).forEach((module) => {
        for (var prop in module) {
            _.extend(context[prop], module[prop]);
        }
    });
});
ar['context'] = context;
module.exports = ar;
