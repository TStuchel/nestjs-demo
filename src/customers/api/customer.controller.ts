import { Controller, UseFilters, Get, Param, NotFoundException, Post, Body } from '@nestjs/common';
import { GlobalExceptionFilter } from '../../common/api/global.exception.filter';
import { CustomerDTO } from './contract/customer.contract';
import { CustomerTranslator } from './customer.translator';
import { Customer } from '../domain/customer.entity';
import { CustomerService } from '../app/customer.service';

/**
 * This REST API controller is responsible for providing an API for managing Customer entities.
 * <p>
 * DEVELOPER NOTE: The first layer of a web application is the "API" layer. In this case, this layer is implemented
 * using a REST-ful endpoint that exposes a way to retrieve a Customer object via the Customer's ID.
 * <p>
 * The @Controller annotation tells Spring that this class is a "controller" that can handle incoming HTTP
 * requests.
 */
@Controller('v1/customers')
@UseFilters(new GlobalExceptionFilter()) // Handles exceptions thrown by the application.
export class CustomerController {

    /**
     * DEVELOPER'S NOTE:
     * <p>
     * This class has dependencies (requires... needs it to work... can't live without it) with classes from the next
     * "service" layer of the application called "CustomerService". It's pretty common to have a suffixed naming
     * convention for classes in each layer. Note that this variable is both private and readonly. Once the variable is
     * set (in the constructor), it will never be changed again.
     * <p>
     * Back when NestJS was launched NestJS used the @Module configurations to instantiate each of the classes that 
     * are injected here.
     */
    public constructor(
        private readonly customerService: CustomerService,
        private readonly customerTranslator: CustomerTranslator
    ) { }

    /**
     * Given a customer ID, find and return a Customer with the given ID.
     */
    @Get('/:customerId')
    public async findCustomer(@Param('customerId') customerId: string): Promise<CustomerDTO> {

        // Find the customer
        const customer: Customer | null = await this.customerService.findCustomer(customerId)

        // Customer not found?
        if (!customer) {
            throw new NotFoundException(`Customer [${customerId}] was not found.`);
        }

        // Translate to contract and return 200-OK
        return this.customerTranslator.toContract(customer);
    }

    /**
     * Given a Customer contract, create and return the created Customer.
     */
    @Post()
    public async createCustomer(@Body() customerDto: CustomerDTO): Promise<CustomerDTO> {

        // Translate to entity
        const customer = this.customerTranslator.toEntity(customerDto)

        // Create the customer
        const newCustomer = await this.customerService.createCustomer(customer)

        // Return the created entity and 201-CREATED
        return this.customerTranslator.toContract(newCustomer)
    }

}
