import { Controller, Param, Get } from '../../../../src'
import { Context } from 'koa'

@Controller('/commodity')
export default class CommodityController {
  @Get('/')
  async getCommodity(id: any){
    return [{ id: 'INx5', name: 'iphone4s' }];
  }
}