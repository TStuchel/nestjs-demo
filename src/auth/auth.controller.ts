import { Controller, Get, Request, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { BasicAuthResult } from "basic-auth";
import auth = require("basic-auth");
import { IncomingMessage } from "http";

/**
 * This controller provides basic authentication to respond with a JWT token given a user's valid
 * credentials (username/password).
 */
@Controller()
export class AuthController {

    // Injected Dependencies
    constructor(
        private readonly authService: AuthService
    ) { }

    /**
     * Given an HTTP request containing Basic Auth credentials, return a JWT token.
     */
    @Get('/v1/token')
    async getToken(@Request() req: IncomingMessage): Promise<string> {

        // Get the credentials from basic auth
        const user: BasicAuthResult | undefined = auth(req)
        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        // Create a token
        const token: string | null = await this.authService.login(user.name, user.pass)
        if (!token) {
            throw new UnauthorizedException("Invalid credentials")
        }

        // Return if the token is valid
        return token
    }

}