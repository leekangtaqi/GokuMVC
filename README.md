GokuMVC
==============
A Nodejs WebApp Framework base on Typescript

Goku'll make your code more cleaner and simpler

No need to register routes again and again, all you need to do is define controllers only, Goku will help you deal with the next things.
Usage
====
You need a startup invocation to load all the controllers, that's it.

    registerActionsInKoa(app, [path.join(__dirname, '../controllers')]);
how to define a controller

    @Controller('/user')
    class UserController{
      @Get('/:id')
      @log
      @Middleware([fn1])
      async getUserById(@Param() id: string){
        await ...
      }
      
      @Post('/')
      @log
      async createUser(@Body user: any){
        await ...
      }
      
      private fn1(){
        //private middleware
        //todo something
      }
    }
