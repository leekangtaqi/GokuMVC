import apiControllers = require('./api');
import modulesControllers = require('./modules');
export function index(app){
    apiControllers.index(app);
    modulesControllers.index(app);
}