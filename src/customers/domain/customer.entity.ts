import { ICustomer } from "../model/customer.model";
import { BusinessException } from "../../common/business.exception";
import { ValidationError } from "../../common/validation.error";

/**
 * Business entity representing a Customer.
 * <p>
 * DEVELOPER NOTE: Note that this class implements the ICustomer interface, which is the same interface 
 * as the CustomerModel. See the classes in customer.model.ts. This business entity is able to be 
 * persisted to MongoDB. Business entities should contain all of the business logic of the application, 
 * except for business logic that must manipulate multiple entities at the same time (those cases belong 
 * in the service classes).
 */
export class Customer implements ICustomer {

    /**
     * DEVELOPER'S NOTE: Replicated here to match ICustomer.
     */
    customerId: string
    fullName: string
    streetAddress: string

    /**
     * DEVELOPER'S NOTE: Takes an object that matches an ICustomer. This trick enables the constructor
     * to take an object with named parameters, making calling this constructor more self-documenting.
     */
    constructor(customer: ICustomer) {
        this.customerId = customer.customerId
        this.fullName = customer.fullName
        this.streetAddress = customer.streetAddress
    }

    /**
     * Validate this Customer, throwing a BusinessException containing all of the invalid properties
     * or business rule failures.
     */
    public validate() {

        // Potential validation errors
        const validationErrors: ValidationError[] = []

        // Check state
        if (!this.streetAddress) {
            validationErrors.push(new ValidationError("The customer's street address is required.", "streetAddress"))
        }
        if (!this.fullName) {
            validationErrors.push(new ValidationError("The customer's full name is required.", "fullName"))
        }

        // Throw exception if anything is incorrect
        if (validationErrors.length) {
            throw new BusinessException("Invalid Customer", validationErrors)
        }
    }

}