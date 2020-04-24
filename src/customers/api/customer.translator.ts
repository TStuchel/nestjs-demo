import { Injectable } from "@nestjs/common";
import { Customer } from "../domain/customer.entity";
import { CustomerDTO } from "./contract/customer.contract";

/**
 * Translate to and from CustomerDTO web service contracts and Customer business entities.
 * <p>
 * DEVELOPER NOTE: This layer of abstraction may seem like overkill. However, if you tie your business logic to web
 * service contract classes, then it becomes increasingly difficult to version your web service endpoints. Having a
 * separate entity class, even if it's nearly identical to the contract class, allows for an evolving layer of business
 * logic while at the same time remaining backward compatible with any API versioning that is necessary. Also, having
 * proper business entity classes allows for implementing the "tell, don't ask" design principle.
 */
@Injectable()
export class CustomerTranslator {

    /**
     * Translate the given Customer to a new CustomerDTO contract.
     */
    toContract(customer: Customer): CustomerDTO {
        return new CustomerDTO(
            customer.customerId,
            customer.streetAddress,
            customer.fullName
        )
    }

    /**
     * Translate the given CustomerDTO to a new Customer entity.
     */
    toEntity(customerDto: CustomerDTO): Customer {
        return new Customer({
            customerId: customerDto.customerId,
            streetAddress: customerDto.streetAddress,
            fullName: customerDto.fullName
        })
    }

}