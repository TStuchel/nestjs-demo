import { Module } from '@nestjs/common'
import { UserService } from './user.service';

@Module({

    // DEVELOPER'S NOTE: NestJS registration of @Injectable() classes instantiated within this module.
    providers: [UserService],

    // DEVELOPER'S NOTE: NestJS subset of providers: exported/shared out of this module.
    exports: [UserService]
})

export class UsersModule { }