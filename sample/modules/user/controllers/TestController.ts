import { Controller, Param, Get, UseBefore, UseAfter, Mount } from '../../../../src'
import { mw1, mw2, mw3, composedByMw1AndMw2 } from './UserMiddlewares'

export default class TestController {
  @UseBefore([async function test1(ctx, next){
    console.warn('666')
    await next()
  }])
  @Get('/')
  async findTests() {
    console.warn('33333')
    return '444'
  }
  
  @Get('/:id')
  async findTestById() {
    console.warn('33333')
    return '5555'
  }
}