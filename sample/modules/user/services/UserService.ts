import { Service, IApplicationContext } from '../../../../src'

export interface IUserService {
  find: Function,
  create: Function,
  update: Function,
  findById: Function
}

@Service()
export default class UserService implements IUserService{
  context: IApplicationContext = null

  constructor(context: IApplicationContext){
    this.context = context;
  }

  async create(userMeta: any){
    let User = this.context.models.UserModel
    let user = new User(userMeta)
    await user.save()
    return user
  }

  async update(userMeta: any){
    
  }

  async find(){
    let User = this.context.models.User
    return await User.find().exec()
  }

  async findById(id: string){
    let docs = await this.find();
    return docs[0]
  }
}