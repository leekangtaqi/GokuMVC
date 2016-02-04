var contextLoader = require('./context');
var initApp = require('./app/init');
initApp();
contextLoader.ready(function () {
    require('./app/app');
});
