import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { jwtConstants } from "./auth.constants";
import { UsersModule } from "src/users/users.module";
import { JwtAuthGuard } from "./guards/jwt.guard";

@Module({

  // DEVELOPER'S NOTE: NestJS reference to external modules used by this module.
  imports: [PassportModule, UsersModule, JwtModule.register(jwtConstants)],

  // DEVELOPER'S NOTE: NestJS registration of @Controller() classes instantiated within this module.
  controllers: [AuthController],

  // DEVELOPER'S NOTE: NestJS registration of @Injectable() classes instantiated within this module.
  providers: [AuthService, JwtAuthGuard, JwtStrategy],

  // DEVELOPER'S NOTE: NestJS subset of providers: exported/shared out of this module.
  exports: [JwtAuthGuard]

})

export class AuthModule { }