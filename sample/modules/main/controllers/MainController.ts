import { Controller, Param, Get } from '../../../../src'
import { Context } from 'koa'

@Controller('/')
export default class MainController {
  @Get('/')
  async getMain( { ctx }: { ctx: any } ){
    return `Hello World`
  }
}