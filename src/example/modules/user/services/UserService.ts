import { IApplicationContext } from '../../../../context'
import { Service } from '../../../../Decorators'

export interface IUserService {
  create: Function,
  find: Function
}

@Service()
export default class UserService implements IUserService{
  context: IApplicationContext = null

  constructor(context: IApplicationContext){
    this.context = context;
  }

  async create(userMeta: any){
    let User = this.context.models.User
    let user = new User(userMeta)
    await user.save()
    return user
  }

  async find(userMeta: any){
    let User = this.context.models.User
    return await User.find().exec()
  }
}