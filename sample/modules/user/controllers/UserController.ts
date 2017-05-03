import { Controller, Param, Get, UseBefore } from '../../../../src'
import { mw1, mw2, mw3, composedByMw1AndMw2 } from './UserMiddlewares'
import { IUserService } from '../../interfaces'

@Controller('/api/user')
@UseBefore([composedByMw1AndMw2])
export default class UserController {
  @Get('/')
  @UseBefore([mw3])
  async getUser({ ctx }: { ctx: any }) {
    try {
      let UserService: IUserService = ctx.app.ctx.services.UserService
      return await UserService.find()
    } catch (e) {
      console.error(e)
    }
  }

  @Get('/:id')
  async getUserById( @Param('id') id: string, { ctx }: { ctx: any }) {
    try {
      return await ctx.app.ctx.services.UserService.findById(id)
    } catch (e) {
      console.error(e)
    }
  }
}