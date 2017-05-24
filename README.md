GokuMVC
==============
<p align="center">
<a target="_blank">
<img width="180" style="margin: 0" src="https://raw.githubusercontent.com/leekangtaqi/GokuMVC/master/assets/images/gokussj.jpg"/>
</a>
</p>

<p align="center"><b>A Nodejs WebApp Framework - typescript</b></p>
<p align="center"><b>Compatible with koa.js and express.js</b></p>
<p align="center"><b>Goku'll make your code more cleaner and simpler</b></p>

## Tips
No longer compatible with express.js in 3.x

## Start

Simple -

Goku will help you load async service, and startup after all ready.

Remember, you need provide a entry to wire modules for Goku, that's it.

```node
import Application, { IContext } from 'Goku'
import context from './context'
import * as path from 'path'

const app = new Application()

app.domainContext = context

async function main(){
  await app.readyAsync([path.join(__dirname, '../modules')]) // wire modules
  app.listen(config.port, () => {
    console.warn(`application is startup, listening on port ${config.port}`)
  })
}

main();

```

## Controller

Elegent -

controllers method have more semantic, ctx ? req ? res ? goodbye~~

No need to register routes again and again, all you need to do is define controllers only, Goku will help you deal with the next things.

You can get services from the application context. Goku get a big meal for you, do not import services or models anymore, never!

```node
@Controller('/user')
class UserController {
  @Param('id')
  async getUserById(id: string, ctx: IContext, next: Function){
    return await ctx.app.ctx.UserService.findById(id) // get service from application context.
  }

  @Get('/:id')
  @log
  @Render('/index')
  async getUserById(@Param() id: string){
    await ...
  }
      
  @Post('/', {jsonResponse: true})
  @log
  async createUser(@Body user: any){
    await ...
  }
}
```

## Nested router supported
```javascript
// userController.js
import OrderController from '...'

@Controller('/user')
class UserController {
  @Mount('/:id/order', OrderController)
  public routes
  
  @Param('id')
  async getUserById(id: string, ctx: IContext, next: Function){
    return await ctx.app.ctx.UserService.findById(id) // get service from application context.
  }

  @Get('/:id')
  async getUserById(@Param() id: string){
    return await ...
  }
}

// orderController.js
class OrderController {
  @Get('/:id')
  async findOrderById() {
    return await ....
  }
}
```

## Service

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
      let User = this.context.models.User  // get model from service context directly.
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

## Model

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

## Middleware

Cascade - 

You can decorate on a class or a method, goku will help you to register them.

Goku's helper will provide practical tools to help you simplify writing.

compose several middlewares to be a one.

```node.js
import { authA, authB, authC, authD, composedAuthEAndAuthF } from './middlewares'
import { compose } from 'GokuMVC'

@Controller('/user')
@UseBefore([authA, authB, composedAuthEAndAuthF])
class UserController{
  @Param('id')
  async getUserById(id: string, next){
    this.user = await ... //get user by id from db
    await next;
  }

  @Get('/:id')
  @log
  @UseBefore([compose(authC, authD)])
  @Render('/index')
  async getUserById(@Param() id: string){
    await ...
  }
}

```

## Contact
QQ: 2811786667

WX: leekangtaqi
