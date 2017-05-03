import { Service, IApplicationContext } from '../../../../src'

export interface IUserService {
  find(),
  create(user: any),
  update: Function,
  findById(id: string)
}

@Service()
export default class UserService implements IUserService {
  context: IApplicationContext = null

  constructor(context: IApplicationContext) {
    this.context = context;
  }

  async create(userMeta: any) {
    try {
      let User = this.context.models.UserModel
      let user = new User(userMeta)
      await user.save()
      return user
    } catch (e) {
      throw e
    }
  }

  async update(userMeta: any) {

  }

  async find() {
    try {
      let User = this.context.models.User
      return await User.find().exec()
    } catch (e) {
      throw e
    }
  }

  async findById(id: string) {
    try {
      let docs = await this.find();
      return docs[0]
    } catch (e) {
      throw e
    }
  }
}