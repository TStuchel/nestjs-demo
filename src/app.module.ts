import { Module } from '@nestjs/common'
import { CommonModule } from './common/common.module'
import { CustomersModule } from './customers/customers.module'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'

@Module({

  // DEVELOPER'S NOTE: NestJS reference to external modules used by this module.
  imports: [CommonModule, AuthModule, CustomersModule, MongooseModule.forRoot('mongodb://localhost:27017/customers')],

  // DEVELOPER'S NOTE: NestJS registration of @Controller() classes instantiated within this module.
  controllers: [AppController]

})

export class AppModule { }
