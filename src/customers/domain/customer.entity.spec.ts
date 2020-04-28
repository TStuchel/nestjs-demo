import { Customer } from "./customer.entity"
import { BusinessException } from "../../common/business.exception"

// Random string
const randomString = () => { return Math.random().toString(36).substring(2, 15) }

describe('Customer Entity', () => {

    // Test customer
    const newCustomerId: string = randomString()
    const newStreetAddress: string = randomString()
    const newFullname: string = randomString()
    const newCustomer: Customer =
        new Customer({
            customerId: newCustomerId,
            streetAddress: newStreetAddress,
            fullName: newFullname
        })

    // --
    describe('Create a customer', () => {

        // --
        describe('Given values for all properties of a customer', () => {

            it("should set all of the customer's properties", () => {
                expect(newCustomer.customerId).toBe(newCustomerId)
                expect(newCustomer.streetAddress).toBe(newStreetAddress)
                expect(newCustomer.fullName).toBe(newFullname)
            })
        })

    })

    // --
    describe('Validate a customer', () => {

        // --
        describe('Given valid values for all properties of a customer', () => {

            it("should validate be a valid customer entity", async () => {
                await newCustomer.validate()
                // No exception
            })

        })

        // --
        describe('Given missing values for all properties of a customer', () => {

            it("should throw a BusinessException containing all incorrect fields", async () => {
                try {
                    await new Customer({
                        customerId: '',
                        streetAddress: '',
                        fullName: ''
                    }).validate()
                    fail('Should have thrown a business ')
                }
                catch (error) {
                    expect(error).toBeInstanceOf(BusinessException)

                    const businesException: BusinessException = error as BusinessException
                    expect(businesException.message).toBe('Invalid Customer')
                    expect(businesException.name).toBe('BusinessException')
                    expect(businesException.errors.length).toBe(2)
                    expect(businesException.errors.find(err => err.property == "streetAddress")).toBeDefined()
                    expect(businesException.errors.find(err => err.property == "fullName")).toBeDefined()
                }
            })

        })
    })

})