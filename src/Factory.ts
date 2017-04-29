"use strict";
import { DispatcherRunner } from './DispatcherRunner';
import { ExpressServer } from './server/ExpressServer';
import { KoaServer } from './server/KoaServer';
import { IDomainContext } from './domain';

export function registerActionsInKoaApp(koa: any, context: IDomainContext, requireDirs?: string[]) {
  let koaApp = new KoaServer(koa);
  let dispatcherRunner = new DispatcherRunner(koaApp, context);

  if (requireDirs && requireDirs.length) {
    requireDirs.map(dir => dispatcherRunner.loadFiles(dir, null, true));
  }
  dispatcherRunner.registerAllActions();
  dispatcherRunner.wireModules();

  return dispatcherRunner;
}

export function registerActionsInExpressApp(express: any, context: IDomainContext, requireDirs?: string[]) {
  let expressApp = new ExpressServer(express);
  let dispatcherRunner = new DispatcherRunner(expressApp, context);

  if (requireDirs && requireDirs.length) {
    requireDirs.map(dir => dispatcherRunner.loadFiles(dir, null, true));
  }

  dispatcherRunner.registerAllActions();
  dispatcherRunner.wireModules();

  return dispatcherRunner;
}