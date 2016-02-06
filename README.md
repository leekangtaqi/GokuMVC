GokuMVC
==============
A Nodejs WebApp Framework base on Typescript

Usage
====
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
