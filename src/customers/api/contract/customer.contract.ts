/**
 * DEVELOPER NOTE: This customer class is an immutable "Data Transfer Object" or "DTO". It is the TypeScript implementation 
 * of the JSON contract sent to this web service. It is JSON that defines the contract, not this class. This class is just
 * the "Java interpretation" of the contract. DTO contract classes should not have any business logic in them at all
 * except for perhaps light contract-centric validations.
 */
export class CustomerDTO {

    constructor(
        public readonly customerId: string,
        public readonly streetAddress: string,
        public readonly fullName: string
    ) { }

}