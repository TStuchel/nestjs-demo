import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from './customers/customers.module';
import { GlobalExceptionFilter } from './common/api/global.exception.filter';

@Module({
  imports: [CustomersModule, MongooseModule.forRoot('mongodb://localhost:27017/customers')],
  controllers: [AppController],
  providers: [GlobalExceptionFilter],
})
export class AppModule { }
