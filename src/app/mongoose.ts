import settings = require('../settings');
import mongoose = require('mongoose');
import logger = require('./logging');

var makeUrl = (mongo)=>{
    const authPart = mongo.username + ':' + mongo.password + '@';
    const auth = mongo.username ? authPart : '';
    return 'mongodb://' + auth + mongo.host + ':' + mongo.port + '/' + mongo.db;
};

var url = makeUrl(settings.mongo);
var options = {};

mongoose.connect(url, options, (err)=>{
    logger.logger.info('Mongoose is connected to ' + url);
});
mongoose.connection.on('error', (err)=>{
    logger.logger.error('Mongoose error happens:' + err);
});

export = mongoose;

