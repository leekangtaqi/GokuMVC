import UserSerivice = require('./User');
import Promise = require('bluebird');
import context = require('../../../context/context');

export var user = Promise.promisifyAll(new UserSerivice(context));