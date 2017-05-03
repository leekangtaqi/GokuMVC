import { Controller, Param, Get } from '../../../../src'

@Controller('/commodity')
export default class CommodityController {
  @Get('/')
  async getCommodity(id: any){
    return [{ id: 'INx5', name: 'iphone4s' }];
  }
}