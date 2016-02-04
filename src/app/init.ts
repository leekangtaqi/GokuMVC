declare var require;
export = function(){
    global['_'] = require('underscore');
    global['Controller'] = function (target){
        
    }
    global['applicationContext'] = require('../context');
}