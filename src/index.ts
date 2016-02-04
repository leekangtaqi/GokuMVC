import contextLoader = require('./context');
import initApp = require('./app/init');
initApp();
contextLoader.ready(function(){
    require('./app/app');
});