import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport';

/**
 * This guard intercepts incoming requests into controllers annotated with @UseGuards(JwtAuthGuard)
 * and requires that any request made into them have a valid JWT Authorization token in the HTTP request 
 * header. ALL controllers should be protected in this way except the AuthController that allows a
 * user to get the JWT token using their credentials.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
