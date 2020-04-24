import { ValidationError } from 'class-validator'

/**
 * This exception type is used to distinguish business-layer exceptions from other types of exceptions.
 */
export class BusinessException extends Error {

  constructor(message: string, readonly errors: ValidationError[]) {
    super(message)
    this.name = "BusinessException"
  }

}