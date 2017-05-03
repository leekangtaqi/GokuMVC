import { Controller, Param, Get, IContext } from '../../../../src'

@Controller('/')
export default class MainController {
  @Get('/')
  async getMain( { ctx }: { ctx: IContext } ){
    return `Hello World`
  }
}