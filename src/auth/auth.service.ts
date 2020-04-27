import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserService } from "./user/user.service"
import { User } from "./user/user.entity"


@Injectable()
export class AuthService {

    // Injected Dependencies
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    /**
     * Validate the given credentials and return a JWT token if valid.
     */
    async login(username: string, password: string): Promise<any> {

        // Get the user with the given username/password
        const user: User | undefined = await this.userService.findOne(username, password)
        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        // Return the token with the user info
        return {
            token: this.jwtService.sign({ 
                userId: user.userId, 
                username: user.username,
                permissions: user.permissions
            })
        }
    }
}