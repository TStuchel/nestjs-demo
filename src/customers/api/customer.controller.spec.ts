import * as request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing';
import { CustomersModule } from '../customer.module';
import { Customer } from '../domain/customer.entity';
import { CustomerService } from '../app/customer.service';
import { INestApplication } from '@nestjs/common';
import { User } from '../../auth/user/user.entity';

// Random string
const randomString = () => { return Math.random().toString(36).substring(2, 15) }

// JWT token used for testing
const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6WyJWSUVXX0NVU1RPTUVSIiwiQ1JFQVRFX0NVU1RPTUVSIl0sImlhdCI6MTU4Nzk5ODgxM30.FKQy2_uRQ5ak2A2gsmkND7WehROMDcmNh4UsJP4mhdM';

// Stub Customer
const customer: Customer =
  new Customer({
    customerId: randomString(),
    streetAddress: randomString(),
    fullName: randomString()
  })

// Helper method to initialize the Nest environment w/dependencies
const initializeNest = async (customerService: any): Promise<INestApplication> => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [
      CustomersModule,
    ],
  })
    .overrideProvider(CustomerService).useValue(customerService)
    .compile()
  return await moduleRef.createNestApplication().init()
}

describe('Customer Controller', () => {

  // --
  describe('Find a customer by ID', () => {

    // GIVEN a customer exists in the system AND a customer ID is provided
    test('GET /v1/customers/:customerId', async () => {

      // Initialize NestJS environment
      const app: INestApplication = await initializeNest({
        findCustomer: async (clientUser: User, customerId: string) => {
          return customer
        }
      })

      // WHEN the find customer by ID endpoint is called
      request(app.getHttpServer())
        .get(`/v1/customers/${customer.customerId}`)
        .set('Authorization', `Bearer ${jwtToken}`)

        // THEN the response should have an HTTP status code of 200-OK
        .expect(200)

        // AND the response body should contain the requested customer
        .expect(response => {
          expect(response.body.customerId).toBe(customer.customerId)
          expect(response.body.streetAddress).toBe(customer.streetAddress)
          expect(response.body.fullName).toBe(customer.fullName)
        })

      // Shut down Nest
      await app.close()
    })

    // GIVEN a customer does not exist in the system AND a customer ID is provided
    test('GET /v1/customers/:customerId', async () => {

      // Initialize NestJS environment
      const app: INestApplication = await initializeNest({
        findCustomer: async (clientUser: User, customerId: string) => {
          return null
        }
      })

      // WHEN the find customer by ID endpoint is called
      request(app.getHttpServer())
        .get(`/v1/customers/${customer.customerId}`)
        .set('Authorization', `Bearer ${jwtToken}`)

        // THEN the response should have an HTTP status code of 404-Not Found
        .expect(404)

        // AND the response body should contain the expected error
        .expect(response => {
          expect(response.body.url).toBe(`/v1/customers/${customer.customerId}`)
          expect(response.body.statusCode).toBe(404)
          expect(response.body.message).toBe(`Customer [${customer.customerId}] was not found.`)
          expect(response.body.type).toBe('NotFoundException')
        })

      // Shut down Nest
      await app.close()
    })

  })

  // --
  describe('Create a customer', () => {

    // GIVEN the details of a new customer
    test('POST /v1/customers', async () => {

      // Initialize NestJS environment
      const app: INestApplication = await initializeNest({
        createCustomer: async (clientUser: User, customerId: string) => {
          return customer
        }
      })

      // WHEN the create customer endpoint is called
      request(app.getHttpServer())
        .post(`/v1/customers`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(customer)

        // THEN the response should have an HTTP status code of 201-Created
        .expect(201)

        // AND the response body should contain the newly created customer
        .expect(response => {
          expect(response.body.customerId).toBe(customer.customerId)
          expect(response.body.streetAddress).toBe(customer.streetAddress)
          expect(response.body.fullName).toBe(customer.fullName)
        })

      // Shut down Nest
      await app.close()
    })
  })

})