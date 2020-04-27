import { Module } from '@nestjs/common'
import { GlobalExceptionFilter } from './global.exception.filter';

@Module({

    // @Injectable() classes instantiated within this module.
    providers: [
        GlobalExceptionFilter,
    ],

    // Subset of 'providers:' exposed/exported to external modules (this module's public API).
    exports: [
        GlobalExceptionFilter,
    ]
})

export class CommonModule { }
