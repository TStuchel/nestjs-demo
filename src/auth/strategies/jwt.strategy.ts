import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants } from '../auth.constants'

/**
 * The JwtStrategy is used to extract the JWT token from incoming requests, decrypt them knowing the
 * decryption key
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  // Initialize the JwtStrategy to read the JWT token from the Authorization header.
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // Optionally validate the payload of the JWT and return its contents
  async validate(payload: any) {
    return payload
  }
}