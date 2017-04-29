GokuMVC
==============

<img width="180" height="220" src="http://h.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=78ccb0ac7f310a55c471d6f082756f9f/a71ea8d3fd1f413418f02f21231f95cad0c85ead.jpg"/>

A Nodejs WebApp Framework - typescript

Goku'll make your code more cleaner and simpler

**Usage**

You need a startup invocation to load all the controllers, that's it.

```node
registerActionsInExpressApp(app, [path.join(__dirname, '../controllers')]);
```

**Example**

***controller***

Elegent -

controllers method have more semantic, ctx ? req ? res ? goodbye~~

No need to register routes again and again, all you need to do is define controllers only, Goku will help you deal with the next things.

You can get services from the application context. Goku get a big meal for you, do not import services or models anymore, never!

```node
@Controller('/user')
class UserController{
  @Param('id')
  async getUserById(id: string, next){
    this.user = await ... //get user by id from db
    await next;
  }

  @Get('/:id')
  @log
  @Middleware([filter])
  @Render('/index')
  async getUserById(@Param() id: string){
    await ...
  }
      
  @Post('/', {jsonResponse: true})
  @log
  async createUser(@Body user: any){
    await ...
  }
      
  private async filter(req: IRequest, res: IResponse, next: Function){
    //middleware
    //todo something
    await ...
    await next; // do chain
  }
}
```
***Service***

DI - 

Application context and domain context will be injected when the service instance create

You can get models froms application context easily and do not import anymore.

```node.js
  import { IApplicationContext } from 'GokuMVC/context'
  import { Service } from 'GokuMVC/Decorators'

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
```

***Model***

Pure - 

Model will be a pojo, without any dependencies.

Goku's domain builder will build it to a Mongoose model, you do not do anything, decribe it only.

```node.js
'use strict';
import { Domain } from 'GokuMVC/Decorators';

export interface IUser {
  username: string
}

@Domain()
class User {
  username = {
    type: String
  }
  options = {
    timestamps: true
  }
}

```

**TODO**
1. Services intergration
3. BeanFactory
4. WebComponentFactory

**Contact**
QQ: 2811786667
