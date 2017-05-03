import { compose } from '../../../../src'

let mw1 = async function (ctx: any, next: Function) {
  console.warn('mw1')
  await next()
  console.warn('mw1 end')
}
let mw2 = async function (ctx: any, next: Function) {
  console.warn('mw2')
  await next()
}
let composedByMw1AndMw2 = compose(mw1, mw2)
let mw3 = async function (ctx: any, next: Function) {
  console.warn('mw3')
  await next()
}

export {
  mw1,
  mw2,
  mw3,
  composedByMw1AndMw2
}