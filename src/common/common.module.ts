import { Module, Global } from '@nestjs/common'
import { GlobalExceptionFilter } from './api/global.exception.filter';

@Global()
@Module({
    providers: [GlobalExceptionFilter]
})

export class CommonModule { }
