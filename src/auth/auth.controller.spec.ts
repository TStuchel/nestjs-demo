import * as request from 'supertest'
import { INestApplication } from "@nestjs/common"
import { TestingModule, Test } from "@nestjs/testing"
import { AuthModule } from "./auth.module"
import { AuthService } from "./auth.service"
import { User } from "./user/user.entity"

// Random string
const randomString = () => { return Math.random().toString(36).substring(2, 15) }

// JWT token used for testing
const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6WyJWSUVXX0NVU1RPTUVSIiwiQ1JFQVRFX0NVU1RPTUVSIl0sImlhdCI6MTU4Nzk5ODgxM30.FKQy2_uRQ5ak2A2gsmkND7WehROMDcmNh4UsJP4mhdM';

// Stub Customer
const user: User =
    new User({
        userId: 1234,
        username: randomString(),
        password: randomString(),
        permissions: []
    })

// Helper method to initialize the Nest environment w/dependencies
const initializeNest = async (authService: any): Promise<INestApplication> => {
    const moduleRef: TestingModule = await Test.createTestingModule({
        imports: [
            AuthModule,
        ],
    })
        .overrideProvider(AuthService).useValue(authService)
        .compile()
    return await moduleRef.createNestApplication().init()
}

// --
describe('Auth Controller', () => {

    // --
    describe('Get a JWT token', () => {

        let app: INestApplication

        // GIVEN valid user credentials
        test('GET /v1/token', async (done) => {

            // Initialize NestJS environment
            app = await initializeNest({
                login: async (username: string, password: string): Promise<any> => {
                    return { token: jwtToken }
                }
            })

            // WHEN the find customer by ID endpoint is called
            const basicAuth: string = new Buffer(`${user.username}:${user.password}`).toString('base64')
            request(app.getHttpServer())
                .get('/v1/token')
                .set('Authorization', `Basic ${basicAuth}`)

                // THEN the response should have an HTTP status code of 200-OK
                .expect(200)

                // AND the response body should contain a newly created token
                .expect(response => {
                    expect(response.body.token).toBe(jwtToken)
                })
                .end(done)

        })

        // GIVEN invalid user credentials
        test('GET /v1/token', async (done) => {

            // Initialize NestJS environment
            app = await initializeNest({
                login: async (username: string, password: string): Promise<any> => {
                    return null
                }
            })

            // WHEN the find customer by ID endpoint is called
            const basicAuth: string = new Buffer(`${user.username}:${user.password}`).toString('base64')
            request(app.getHttpServer())
                .get('/v1/token')
                .set('Authorization', `Basic ${basicAuth}`)

                // THEN the response should have an HTTP status code of 401-Unauthorized
                .expect(401)

                // AND the response body should contain the expected error
                .expect(response => {
                    expect(response.body.statusCode).toBe(401)
                    expect(response.body.message).toBe('Invalid credentials')
                    expect(response.body.error).toBe('Unauthorized')
                })
                .end(done)
        })

        // GIVEN missing user credentials
        test('GET /v1/token', async (done) => {

            // Initialize NestJS environment
            app = await initializeNest(null)

            // WHEN the find customer by ID endpoint is called
            request(app.getHttpServer())
                .get('/v1/token')

                // THEN the response should have an HTTP status code of 401-Unauthorized
                .expect(401)

                // AND the response body should contain the expected error
                .expect(response => {
                    expect(response.body.statusCode).toBe(401)
                    expect(response.body.message).toBe('Invalid credentials')
                    expect(response.body.error).toBe('Unauthorized')
                })
                .end(done)
        })

        // Shut down Nest
        afterEach(async () => {
            await app.close()
        })
    })
})