import { IContext } from './app'

export interface IMiddleware {
  use(ctx: IContext, next: Function): void
}

async function recurExec(ctx: any, arr: Array<any>) {
  if (!arr || !arr.length) {
    return;
  }
  let curr = arr[0]
  return await curr(ctx, async (...args: Array<any>) => await recurExec(ctx, arr.slice(1)))
}

export function compose(...middlewares: Array<any>): Function {
  return async function (ctx: IContext, next: Function) {
    let res = await recurExec(ctx, middlewares)
    await next(res);
  }
}
