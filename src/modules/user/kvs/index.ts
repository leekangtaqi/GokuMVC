import Promise = require('bluebird');
import context = require('../../../context/context');
import User = require('./User');

export var user = Promise.promisifyAll(new User(context));