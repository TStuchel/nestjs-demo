import { Controller, Get, UseFilters } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/global.exception.filter';

@Controller()
@UseFilters(GlobalExceptionFilter) // Handles exceptions thrown by the application.
export class AppController {

  @Get('/')
  healthCheck(): string {
    return "Service active!"
  }
}
