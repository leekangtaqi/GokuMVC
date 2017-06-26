import * as Koa from 'koa'
import _ from './util'
import ApplicationContext from './context'
import AllReady from './lib/allready'
import * as path from 'path'
import { Context } from 'Koa'
import { IDomainContext } from './domain'
import { registerActionsInExpressApp, registerActionsInKoaApp } from './Factory'
import test from './test';

let ar = new AllReady();

export interface IApplication {
  domainContext?: IDomainContext;
  readyAsync?: Function;
  addMember?: Function;
  sysMembers?: Array<any>;
  ready?: Function;
  ctx?: ApplicationContext;
}

declare interface IContext extends Context {
  // app: Application
}

export { IContext }

export default class Application extends Koa implements IApplication {
  sysMembers: Array<any> = []
  domainContext: IDomainContext = null
  ctx: ApplicationContext = new ApplicationContext()

  addMember(name: string, inst: any) {
    this.sysMembers.push({ name, inst })
  }

  ready(entries: Array<string>, callback: Function) {
    _.assert(
      entries,
      `application expected several entries to wire modules.`)

    _.assert(
      this.domainContext,
      `application expected a applicationContext.`)

    if (this.sysMembers && this.sysMembers.length) {
      for (let { name, inst } of this.sysMembers) {
        if (name === 'redis' || name === 'mongoose') {
          ar.add(name, ar[name](inst))
        } else {
          ar.add(name, inst)
        }
      }
    }

    registerActionsInKoaApp(this, this.domainContext, entries)
    // registerActionsInExpressApp(this, entries)

    ar.ready(callback)
  }

  async readyAsync(entries: Array<string>) {
    return new Promise(r => {
      this.ready(entries, () => {
        r()
      })
    })
  }
}