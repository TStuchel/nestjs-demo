import { Injectable } from '@nestjs/common'
import { CustomerModel } from '../model/customer.model'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Customer } from '../domain/customer.entity';

/**
 * This class provides business functionality for managing Customers.
 * <p>
 * DEVELOPER NOTE: This is the second, and middle, layer of a web application. It is frequently called the "service
 * layer" or "business logic layer". This layer is the core of the application, containing the classes that actually
 * provide business value and define the real functionality of the application. Previously, the API/Controller layer
 * cared only about receiving and returning JSON requests. This class is the real meat of the system... and
 * theoretically shouldn't know anything about the fact that it "lives" in a web application. There's nothing related to
 * JSON, REST, HTTP, or web services here.
 * <p>
 * Also, this layer shouldn't care from *where* it gets the data that it operates on. Service classes shouldn't  know
 * anything about databases, external web services, file systems, or any other technicalities of shuttling data around
 * the system. That's the job of the final layer.
 */
@Injectable()
export class CustomerService {

    /**
     * DEVELOPER'S NOTE: NestJS performs constructor-based dependency injection to pass singleton
     * instances of these classes into this object. In addition, 
     */
    public constructor(
        @InjectModel('Customer') private readonly customerModel: Model<CustomerModel>
    ) { }

    /**
     * Given a customer ID, find and return a Customer with the given ID.
     */
    public async findCustomer(customerId: string): Promise<Customer | null> {

        // Protect findOne()
        if (!this.isValidCustomerId(customerId)) {
            return null;
        }

        // Find the customer
        const customer: CustomerModel | null = await this.customerModel.findOne({ _id: customerId })
        if (customer) {
            customer.customerId = customer._id
        }
        return customer
    }

    /**
     * Given a Customer, create and return a Customer with a new ID.
     */
    public async createCustomer(customer: Customer): Promise<Customer> {

        // Validate the Customer (may throw BusinessException)
        customer.validate()

        // Create the customer
        const newCustomer: CustomerModel = new this.customerModel(customer)
        newCustomer.customerId = newCustomer._id
        return await newCustomer.save()
    }

    /**
     * Returns whether or not the given customer ID is valid.
     */
    private isValidCustomerId(customerId: string): boolean {
        return !!customerId && customerId.length === 24
    }

}
