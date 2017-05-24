import { Controller, Param, Get, UseBefore, UseAfter, Mount } from '../../../../src'
import { mw1, mw2, mw3, composedByMw1AndMw2 } from './UserMiddlewares'
import TestController from './TestController'
export default class OrderController {

  @Get('/')
  async findOrders() {
    console.warn('?????')
    return '111'
  }

  @Mount('/test', TestController)
  public routes

  @Get('/:id')
  async findOrdersById() {
    console.warn('?????')
    return '222'
  }
}