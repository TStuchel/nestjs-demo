import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CustomerSchema } from './model/customer.model'
import { CustomerController } from './api/customer.controller'
import { CustomerService } from './app/customer.service'
import { CustomerTranslator } from './api/customer.translator'

/**
 * DEVELOPER'S NOTE: This is a NestJS module, which defines a set of classes that will be instantiated
 * and used for dependency injection upon startup.
 */
@Module({

    // DEVELOPER'S NOTE: NestJS integration with Mongoose for object-relationship mapping (ORM)
    imports: [MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }])],

    // DEVELOPER'S NOTE: NestJS registration of @Controller() classes instantiated within this module.
    controllers: [CustomerController],

    // DEVELOPER'S NOTE: NestJS registration of @Injectable() classes instantiated within this module.
    providers: [CustomerService, CustomerTranslator]
})

export class CustomersModule { }