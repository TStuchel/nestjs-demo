import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { jwtConstants } from "./auth.constants";
import { JwtAuthGuard } from "./jwt/jwt.guard";
import { UserService } from "./user/user.service";
import { CommonModule } from "../common/common.module";

@Module({

  // External modules directly used by this module
  imports: [
    CommonModule,
    PassportModule,
    JwtModule.register(jwtConstants),
  ],

  // @Controller() classes instantiated within this module.
  controllers: [
    AuthController
  ],

  // @Injectable() classes instantiated within this module.
  providers: [
    JwtStrategy,
    AuthService,
    JwtAuthGuard,
    UserService
  ],

  // Subset of 'providers:' exposed/exported to external modules (this module's public API).
  exports: [
    CommonModule,
    JwtAuthGuard,
    UserService
  ]

})

export class AuthModule { }