import { Controller, Param, Get } from '../../../../Decorators'
import { Context } from 'koa'

@Controller('/user')
export default class UserController {
  @Get('/')
  async create({ ctx }){
    try {
      await ctx.app.ctx.services.UserService.create({ username: `user${Math.random()}` })
      return `create successful.`
    } catch(e) {
      console.warn(e)
    }
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string, { ctx }: { ctx: any } ){
    try {
      return await ctx.app.ctx.services.UserService.find()
    } catch(e) {
      console.warn(e)
    }
  }
}