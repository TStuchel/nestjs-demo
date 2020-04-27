import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { BusinessException } from "./business.exception";
import { Request, Response } from 'express';

/**
 * DEVELOPER NOTE: It's good form to always know what HTTP status code your controllers will return and under what
 * conditions. It's bad form to just return 200 for "good" and 500 for "bad". There's a rich collection of choices to
 * return specific HTTP responses depending on the result of the call.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Handle BusinessException
        if (exception instanceof BusinessException) {
            const businessException: BusinessException = exception as BusinessException
            response
                .status(HttpStatus.BAD_REQUEST)
                .json({
                    url: request.url,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: businessException.message,
                    type: businessException.name,
                    errors: businessException.errors
                })
        }

        // All other intentional HttpExceptions
        else if (exception instanceof HttpException) {
            const httpException = (exception as HttpException)
            response
                .status(exception.getStatus())
                .json({
                    url: request.url,
                    statusCode: exception.getStatus(),
                    message: httpException.message,
                    type: exception.constructor.name
                })
        }

        // Unexpected exception
        else {
            response
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                    url: request.url,
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: exception.message,
                    type: exception.constructor.name,
                    stack: exception.stack
                })
            console.error(exception)
        }
    }

}
