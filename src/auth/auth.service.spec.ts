import { User } from "./user/user.entity"
import { UserService } from "./user/user.service"
import { AuthModule } from "./auth.module"
import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { UnauthorizedException } from "@nestjs/common"

// Random string
const randomString = () => { return Math.random().toString(36).substring(2, 15) }

describe('AuthService', () => {

    // Stub User
    const user: User =
        new User({
            userId: 1234,
            username: randomString(),
            password: randomString(),
            permissions: []
        })

    // Helper method to initialize the Nest environment w/dependencies
    const initializeNest = async (userService: any): Promise<TestingModule> => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [
                AuthModule,
            ],
        })
            .overrideProvider(UserService).useValue(userService)
            .compile()
        return moduleRef
    }

    // --
    describe('User login', () => {

        let testingModule: TestingModule
        let authService: AuthService

        // --
        describe('Given a valid username and password of a known User', () => {

            // Initialize NestJS environment
            beforeEach(async () => {
                testingModule = await initializeNest({
                    findOne: async (username: string, password: string): Promise<User | undefined> => {
                        expect(username).toBeTruthy()
                        expect(password).toBeTruthy()
                        return user // Known user
                    }
                })
                authService = testingModule.get<AuthService>(AuthService)
            })

            it('should return an object containing a JWT token', async () => {
                const token: any = await authService.login(user.username, user.password)
                expect(token.token).not.toBeUndefined()
            })

            // Shut down NestJS environment
            afterEach(async () => {
                await testingModule.close()
            })
        })

        // --
        describe('Given an invalid username and password', () => {

            // Initialize NestJS environment
            beforeEach(async () => {
                testingModule = await initializeNest({
                    findOne: async (username: string, password: string): Promise<User | undefined> => {
                        expect(username).toBeTruthy()
                        expect(password).toBeTruthy()
                        return undefined // Unknown user
                    }
                })
                authService = testingModule.get<AuthService>(AuthService)
            })

            it('should throw an UnauthorizedException', async () => {
                try {
                    await authService.login(user.username, user.password)
                    fail("Expected UnauthorizedException")
                }
                catch (error) {
                    expect(error).toBeInstanceOf(UnauthorizedException)
                }
            })

            // Shut down NestJS environment
            afterEach(async () => {
                await testingModule.close()
            })
        })
    })

})