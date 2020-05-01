import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { CustomerModule } from './customers/customer.module'
import { AppController } from './app.controller'

@Module({

  // External modules directly used by this module. At the top level, all modules containing controllers
  // should be listed so that routes can be instantiated.
  imports: [
    AuthModule,
    CustomerModule
  ],

  // @Controller() classes instantiated within this module.
  controllers: [
    AppController
  ]

})

export class AppModule { }
