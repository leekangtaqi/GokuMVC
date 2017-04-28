GokuMVC
==============

<img width="180" height="220" src="http://h.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=78ccb0ac7f310a55c471d6f082756f9f/a71ea8d3fd1f413418f02f21231f95cad0c85ead.jpg"/>

A Nodejs WebApp Framework base on Typescript

Goku'll make your code more cleaner and simpler

No need to register routes again and again, all you need to do is define controllers only, Goku will help you deal with the next things.

**Usage**

You need a startup invocation to load all the controllers, that's it.

```node
registerActionsInExpressApp(app, [path.join(__dirname, '../controllers')]);
```

**Example**

how to define a controller

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

**TODO**
1. Services intergration
3. BeanFactory
4. WebComponentFactory

**Contact**
QQ: 2811786667
