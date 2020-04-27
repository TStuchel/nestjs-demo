import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CustomerSchema } from './model/customer.model'
import { CustomerController } from './api/customer.controller'
import { CustomerService } from './app/customer.service'
import { CustomerTranslator } from './api/customer.translator'
import { AuthModule } from '../auth/auth.module'
import { CommonModule } from '../common/common.module'

/**
 * DEVELOPER'S NOTE: This is a NestJS module, which defines a set of classes that will be instantiated
 * and used for dependency injection upon startup.
 */
@Module({

    // External modules directly used by this module
    imports: [
        // NestJS integration with Mongoose for object-relationship mapping (ORM)
        MongooseModule.forRoot('mongodb://localhost:27017/customers'),
        MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
        CommonModule,
        AuthModule,
    ],

    // @Controller() classes instantiated within this module.
    controllers: [
        CustomerController,
    ],

    // @Injectable() classes instantiated within this module.
    providers: [
        CustomerService,
        CustomerTranslator,
    ],

    // Subset of 'providers:' exposed/exported to external modules (this module's public API).
    exports: [
        CustomerService,
    ]
})

export class CustomersModule { }