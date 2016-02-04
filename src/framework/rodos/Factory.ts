"use strict";
import {DispatcherRunner} from './DispatcherRunner';
import {ExpressServer} from './server/ExpressServer';

export function registerActionsInExpressApp(express: any, requireDirs?:string[]){
    var expressApp = new ExpressServer(express);
    var dispatcherRunner = new DispatcherRunner(expressApp);
    
    if(requireDirs && requireDirs.length){
        requireDirs.map(dir=> dispatcherRunner.loadFiles(dir, null, true)); 
    }
    
    dispatcherRunner.registerAllActions();
    
    return dispatcherRunner;
}