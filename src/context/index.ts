import AllReady = require('../framework/allready/allready');
import DomainBuilder = require('../framework/mongoose/DomainBuilder');
import context = require('./context');
import redisMain = require('../app/redis');
import mongooseMain = require('../app/mongoose');
 
var ar: AllReady = new AllReady();
ar.add('redis', ar.redis(redisMain()));
ar.add('mongoose', ar.mongoose(mongooseMain));

context.redis.main = redisMain(); 
context.mongoose.main = mongooseMain;
context.domainBuilder.main = DomainBuilder;

ar.ready(()=>{
    var modules = require('../modules');
    _.values(modules).forEach((module)=>{
        for(var prop in module){
            _.extend(context[prop], module[prop]);
        }
    });
});

ar['context'] = context;

export = ar;