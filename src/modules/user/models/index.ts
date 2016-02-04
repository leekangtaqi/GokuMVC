import UserModelBuilder = require('./User');
import context = require('../../../context/context');
 
export var User = UserModelBuilder.User(context.domainBuilder.main);