import { Test, TestingModule } from '@nestjs/testing'
import { CustomerService } from './customer.service'
import { CustomerModule } from '../customer.module'
import { User } from '../../auth/user/user.entity'
import { Customer } from '../domain/customer.entity'
import { CustomerPermission } from '../../auth/permissions/customer.permission'
import { getModelToken } from '@nestjs/mongoose'
import { ForbiddenException } from '@nestjs/common'
import { BusinessException } from '../../common/business.exception'
import { randomString } from "../../common/test.utils"
import * as sinon from 'sinon'
import { CustomerModel } from '../model/customer.model'
import { Model } from 'mongoose'

// Helper function to create a customer ID
const createCustomerId = () => {
  return "012345678901234567890123" // 24 characters
}

// Stub Customer
const expectedCustomer: Customer = new Customer(
  {
    customerId: randomString(),
    streetAddress: randomString(),
    fullName: randomString()
  })

// Helper function to create a user
const createTestUser = (permissions: any[]) => new User({
  userId: 2,
  username: 'user',
  password: 'user',
  permissions: permissions
})

// Helper function to create a NestJS testing module
const createTestingModule = async (customerModelMock: any): Promise<TestingModule> => {
  return await Test.createTestingModule({
    imports: [CustomerModule],
  })
    .overrideProvider(getModelToken('Customer')).useValue(customerModelMock)
    .compile()
}

describe('Playground', () => {
  //const customerModel: Model<CustomerModel, {}> = sinon.stub(Model.prototype.base.Model, 'save')
  //const customerModel: sinon.SinonStubbedInstance<Model<CustomerModel>> = sinon.createStubInstance(Model)
  //const customerService: CustomerService = new CustomerService(customerModel)



})

describe('CustomerService', () => {

  // --
  describe('Create customer', () => {

    // --
    describe('Given a user that does not have create permissons', () => {
      const user: User = createTestUser([])

      // Initialize Nest testing module
      let testingModule: TestingModule
      let customerService: CustomerService
      beforeAll(async () => {
        testingModule = await createTestingModule({})
        customerService = testingModule.get<CustomerService>(CustomerService)
      })

      it('should throw a ForbiddenException', async () => {
        try {
          await customerService.createCustomer(user, expectedCustomer)
          fail('Should have thrown a ForbiddenException')
        }
        catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException)
          const exception: ForbiddenException = error as ForbiddenException
          expect(exception.message).toBe('Not authorized to create customers.')
        }
      })

      // Close Nest testing module
      afterAll(async () => {
        await testingModule.close()
      })

    })

    // --
    describe('Given a user that has create permissons but an invalid customer', () => {
      const user: User = createTestUser([CustomerPermission.CREATE_CUSTOMER])

      // Initialize Nest testing module
      let testingModule: TestingModule
      let customerService: CustomerService
      beforeAll(async () => {
        testingModule = await createTestingModule({})
        customerService = testingModule.get<CustomerService>(CustomerService)
      })

      it('should throw a BusinessException', async () => {
        try {
          await customerService.createCustomer(user, new Customer({ customerId: "", fullName: "", streetAddress: "" }))
          fail('Should have thrown a BusinessException')
        }
        catch (error) {
          expect(error).toBeInstanceOf(BusinessException)
        }
      })

      // Close Nest testing module
      afterAll(async () => {
        await testingModule.close()
      })

    })

    // --
    describe('Given a user that has create permissons and a valid customer', () => {
      const user: User = createTestUser([CustomerPermission.CREATE_CUSTOMER])

      // Initialize Nest testing module
      let testingModule: TestingModule
      let customerService: CustomerService
      beforeAll(async () => {
        testingModule = await createTestingModule(function () { // not an arrow()!
          return {
            save: () => { return expectedCustomer }
          }
        })
        customerService = testingModule.get<CustomerService>(CustomerService)
      })

      let actualCustomer: Customer | null
      beforeEach(async () => {
        actualCustomer = await customerService.createCustomer(user, expectedCustomer)
      })

      it('should return the created customer', () => {
        expect(actualCustomer).toBe(expectedCustomer)
      })

      // Close Nest testing module
      afterAll(async () => {
        await testingModule.close()
      })

    })

  })

  // --
  describe('Find customer by ID', () => {

    // --
    describe('Given a user that does not have view permissons', () => {
      const customerId = createCustomerId()
      const user: User = createTestUser([])

      // Initialize Nest testing module
      let testingModule: TestingModule
      let customerService: CustomerService
      beforeAll(async () => {
        testingModule = await createTestingModule({})
        customerService = testingModule.get<CustomerService>(CustomerService)
      })

      it('should throw a ForbiddenException', async () => {
        try {
          await customerService.findCustomer(user, customerId)
          fail('Should have thrown a ForbiddenException')
        }
        catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException)
          const exception: ForbiddenException = error as ForbiddenException
          expect(exception.message).toBe('Not authorized to find customers.')
        }
      })

      // Close Nest testing module
      afterAll(async () => {
        await testingModule.close()
      })
    })

    // --
    describe('Given a user with view permissions and an invalid customer ID', () => {
      const customerId = "INVALID ID" // Not 24 characters
      const user: User = createTestUser([CustomerPermission.VIEW_CUSTOMER])

      // Initialize Nest testing module
      let testingModule: TestingModule
      let customerService: CustomerService
      beforeAll(async () => {
        testingModule = await createTestingModule({})
        customerService = testingModule.get<CustomerService>(CustomerService)
      })

      let customer: Customer | null
      beforeEach(async () => {
        customer = await customerService.findCustomer(user, customerId)
      })

      it('should return null', async () => {
        expect(customer).toBeNull()
      })

      // Close Nest testing module
      afterAll(async () => {
        await testingModule.close()
      })

    })

    // --
    describe('Given user with view permissions and a valid customer ID', () => {
      const customerId = createCustomerId()
      const user: User = createTestUser([CustomerPermission.VIEW_CUSTOMER])

      // Initialize Nest testing module
      let testingModule: TestingModule
      let customerService: CustomerService
      beforeAll(async () => {
        testingModule = await createTestingModule({
          findOne: (filter: any): any => {
            expect(filter).toBeDefined()
            return expectedCustomer
          }
        })
        customerService = testingModule.get<CustomerService>(CustomerService)
      })

      let actualCustomer: Customer | null
      beforeEach(async () => {
        actualCustomer = await customerService.findCustomer(user, customerId)
      })

      it('should return the customer', () => {
        expect(actualCustomer).not.toBeNull()
        expect(actualCustomer?.streetAddress).toBe(expectedCustomer.streetAddress)
        expect(actualCustomer?.fullName).toBe(expectedCustomer.fullName)
      })

      // Close Nest testing module
      afterAll(async () => {
        await testingModule.close()
      })

    })

    // --
    describe('Given user with view permissions and a customer ID that does not exist', () => {
      const customerId = createCustomerId()
      const user: User = createTestUser([CustomerPermission.VIEW_CUSTOMER])

      // Initialize Nest testing module
      let testingModule: TestingModule
      let customerService: CustomerService
      beforeAll(async () => {
        testingModule = await createTestingModule({
          findOne: (filter: any): any => {
            expect(filter).toBeDefined()
            return null
          }
        })
        customerService = testingModule.get<CustomerService>(CustomerService)
      })

      let actualCustomer: Customer | null
      beforeEach(async () => {
        actualCustomer = await customerService.findCustomer(user, customerId)
      })

      it('should return null', () => {
        expect(actualCustomer).toBeNull()
      })

      // Close Nest testing module
      afterAll(async () => {
        await testingModule.close()
      })

    })

  })

})
